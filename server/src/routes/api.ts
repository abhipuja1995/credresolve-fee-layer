import { Router } from 'express';
import { blackbaudClient } from '../services/blackbaudSkyClient.js';
import { feeEngine } from '../services/feeEngine.js';
import { batchQueueWorker } from '../services/batchQueueWorker.js';
import { reconciliationService } from '../services/reconciliationService.js';
import { dataStore } from '../services/mockDataStore.js';

export const apiRouter = Router();

// ==========================================
// 1. Blackbaud Environment & Fee Types Routes
// ==========================================

apiRouter.get('/blackbaud/context', (req, res) => {
  res.json({
    environment: dataStore.environmentContext,
    stats: {
      totalActiveStudents: dataStore.students.filter(s => s.status === 'ACTIVE').length,
      totalFeeTypes: dataStore.feeTypes.length,
      totalDeployedFees: dataStore.fees.size,
      totalBatchesSubmitted: dataStore.batches.size
    }
  });
});

apiRouter.put('/blackbaud/branding', (req, res) => {
  try {
    const { schoolName, logoUrl, primaryColor, secondaryColor, backgroundColor, textColor, surfaceColor } = req.body;
    dataStore.updateBranding({
      schoolName,
      logoUrl,
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      surfaceColor
    });
    res.json({
      success: true,
      branding: dataStore.environmentContext.branding
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/blackbaud/fee-types', async (req, res) => {
  try {
    const feeTypes = await blackbaudClient.getFeeTypes();
    res.json(feeTypes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/blackbaud/fee-types', (req, res) => {
  try {
    const { name, category, glAccountCode, defaultAmount, allowPartialPayment, feeTypeId } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Fee Category name is required.' });
    }
    const newFeeType = dataStore.addFeeType({
      feeTypeId: feeTypeId?.trim(),
      name: name.trim(),
      category: category || 'ACTIVITY',
      glAccountCode: glAccountCode?.trim(),
      defaultAmount: Number(defaultAmount) || 100.00,
      allowPartialPayment: Boolean(allowPartialPayment)
    });
    res.status(201).json(newFeeType);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/blackbaud/batches/:batchId/summary', async (req, res) => {
  try {
    const summary = await blackbaudClient.getTransactionBatchImportSummary(
      dataStore.environmentContext.environmentId,
      req.params.batchId
    );
    res.json(summary);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// ==========================================
// 2. Fee Management Routes
// ==========================================

apiRouter.get('/fees', (req, res) => {
  res.json(feeEngine.getFees());
});

apiRouter.get('/fees/:id', (req, res) => {
  const fee = feeEngine.getFeeById(req.params.id);
  if (!fee) {
    return res.status(404).json({ error: 'Fee not found' });
  }
  res.json(fee);
});

apiRouter.post('/fees', async (req, res) => {
  try {
    const {
      title,
      description,
      bbFeeTypeId,
      baseAmount,
      dueDate,
      academicYear,
      allowPartialPayment,
      minPartialAmount,
      audience,
      customFormSchema,
      glAccountOverride
    } = req.body;

    if (!title || !bbFeeTypeId || !baseAmount || !dueDate || !audience) {
      return res.status(400).json({
        error: 'Missing required fields: title, bbFeeTypeId, baseAmount, dueDate, audience are required.'
      });
    }

    const result = await feeEngine.createAndDeployFee({
      title,
      description: description || '',
      bbFeeTypeId,
      baseAmount: Number(baseAmount),
      dueDate,
      academicYear,
      allowPartialPayment: Boolean(allowPartialPayment),
      minPartialAmount: minPartialAmount ? Number(minPartialAmount) : undefined,
      audience,
      customFormSchema,
      glAccountOverride
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 3. Batch Queue & Ingestion Monitoring
// ==========================================

apiRouter.get('/batches', (req, res) => {
  res.json(batchQueueWorker.getAllJobs());
});

apiRouter.get('/batches/:jobId', (req, res) => {
  const job = batchQueueWorker.getJob(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Batch job not found' });
  }
  res.json(job);
});

// ==========================================
// 4. Students & Subledger Charges
// ==========================================

apiRouter.get('/students', (req, res) => {
  res.json(dataStore.students);
});

apiRouter.post('/students/lookup', (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const result = dataStore.lookupStudent(query);
  if (!result) {
    return res.status(404).json({
      error: `No active student record found matching "${query}". Please check the Roll Number, Mobile Phone, or Email.`
    });
  }

  res.json(result);
});

apiRouter.get('/charges', (req, res) => {
  const { feeId, studentId, status } = req.query;
  const charges = reconciliationService.getStudentCharges({
    feeId: feeId as string,
    studentId: studentId as string,
    status: status as string
  });
  res.json(charges);
});

apiRouter.get('/charges/:id', (req, res) => {
  const charge = reconciliationService.getChargeById(req.params.id);
  if (!charge) {
    return res.status(404).json({ error: 'Charge record not found' });
  }
  
  const fee = feeEngine.getFeeById(charge.feeId);
  res.json({
    charge,
    fee
  });
});

// ==========================================
// 5. Payer 1-Click Checkout & Payment
// ==========================================

apiRouter.post('/checkout/pay', async (req, res) => {
  try {
    const {
      chargeId,
      amount,
      paymentMethod,
      cardDetails,
      customFormResponses,
      waiverSignature
    } = req.body;

    if (!chargeId || !amount || !paymentMethod) {
      return res.status(400).json({
        error: 'Missing required checkout parameters: chargeId, amount, paymentMethod are required.'
      });
    }

    const result = await reconciliationService.processPayment({
      chargeId,
      amount: Number(amount),
      paymentMethod,
      cardDetails,
      customFormResponses,
      waiverSignature
    });

    res.json({
      success: true,
      message: 'Payment captured and subledger reconciled with Blackbaud successfully.',
      ...result
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
