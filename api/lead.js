// Vercel Serverless Function — recebe os leads dos formulários da landing page.
// Rota: POST /api/lead
//
// Este stub valida e registra o lead nos logs da Vercel (Project > Logs) e
// retorna sucesso para o front-end. Para receber os leads por e-mail, integre
// um provedor de envio (ex.: Resend, SendGrid) ou grave em um banco de dados
// (ex.: Supabase, Postgres) substituindo o bloco marcado abaixo.

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  let body = req.body;
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      body = {};
    }
  }

  const { nome, whatsapp, empresa, cidade, valor, quantidade, documentos } = body || {};

  if (!nome || !whatsapp || !empresa) {
    res.status(400).json({ ok: false, error: "missing_required_fields" });
    return;
  }

  const lead = {
    nome,
    whatsapp,
    empresa,
    cidade: cidade || "",
    valor: valor || "",
    quantidade: quantidade || "",
    documentos: documentos || "",
    origem: "landing-page-estefani-sa",
    recebido_em: new Date().toISOString(),
  };

  // Log estruturado — visível em Vercel > Project > Logs.
  console.log("[LEAD ESTEFANI SÁ]", JSON.stringify(lead));

  // ---------------------------------------------------------------------
  // TODO: integrar envio de e-mail / CRM aqui, por exemplo:
  //
  // await fetch("https://api.resend.com/emails", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     from: "Site Estefani Sá <site@seudominio.com.br>",
  //     to: ["contato@estefanisa.com.br"],
  //     subject: `Novo lead: ${lead.empresa}`,
  //     text: JSON.stringify(lead, null, 2),
  //   }),
  // });
  // ---------------------------------------------------------------------

  res.status(200).json({ ok: true });
};
