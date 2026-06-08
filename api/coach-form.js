export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  try {
    // Create lead in Close CRM
    const closeRes = await fetch('https://api.close.com/api/v1/lead/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('api_6wttwig7Uve2WAP12ZFcd4.1YzHQYqmsm5NLUgybNPVo7:').toString('base64')
      },
      body: JSON.stringify({
        name: name,
        contacts: [{
          name: name,
          phones: [{ phone: phone, type: 'office' }]
        }]
      })
    });

    const closeData = await closeRes.json();
    const leadId = closeData.id;
    const profileUrl = leadId ? `https://app.close.com/leads/${leadId}/` : 'N/A';

    // Post to Discord
    await fetch('https://discord.com/api/webhooks/1513627231232987226/2O_Dd93Q-VX6fnGFsN0SB9ez6N-Sfc6dTQw7HBjt5ghVX1l-x1zKk8iM9tTzBaFdU7AU', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `📞 **New Call Request**\n**Name:** ${name}\n**Phone:** ${phone}\n**Close CRM:** ${profileUrl}`
      })
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
