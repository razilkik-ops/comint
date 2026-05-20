async function submitLeadToCRM(lead) {
  const normalizedLead = {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    company: lead.company,
    category: lead.category,
    productOrService: lead.productOrService,
    quantity: lead.quantity,
    comment: lead.comment,
    sourcePage: lead.sourcePage,
    createdAt: new Date().toISOString()
  };

  // Здесь будет подключен Bitrix24 webhook/API.
  // Например: await fetch(process.env.BITRIX24_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(normalizedLead) });
  console.log('Mock CRM lead:', normalizedLead);

  return {
    ok: true,
    message: 'Спасибо! Заявка отправлена. Менеджер свяжется с вами в ближайшее время.',
    lead: normalizedLead
  };
}

module.exports = { submitLeadToCRM };
