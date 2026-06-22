export function mockVoiceResponse(message: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="sv-SE">${escapeXml(message)}</Say>
</Response>`;
}

function escapeXml(input: string) {
  return input.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] ?? c));
}
