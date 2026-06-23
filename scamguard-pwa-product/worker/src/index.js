const json = (data, init = {}) => new Response(JSON.stringify(data, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', ...init.headers }, ...init });

const demoCalls = [
  { id:'c1', from:'+46 73 402 18 91', name:'Okänt nummer', status:'blocked', risk:94, label:'Blockerat', time:'Idag 14:22', summary:'Påstod sig ringa från banken och bad om BankID. AI stoppade samtalet och varnade anhörig.', reasons:['Bad om BankID','Skapade tidspress','Ville att användaren skulle logga in'] },
  { id:'c2', from:'+46 8 555 102 10', name:'Vårdcentralen', status:'passed', risk:12, label:'Släpptes igenom', time:'Idag 10:04', summary:'Identifierade sig tydligt, ärendet var bokad tid. Samtalet kopplades vidare.', reasons:['Tydlig avsändare','Ingen ekonomisk begäran','Låg risk'] },
  { id:'c3', from:'+44 20 7946 0412', name:'Okänt utlandssamtal', status:'review', risk:71, label:'Krävde bekräftelse', time:'Igår 17:41', summary:'Oklart ärende och hög press. Appen bad anhörig granska innan vidarekoppling.', reasons:['Okänt utlandsnummer','Otydligt ärende','Hög press'] }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/status') return json({ ok:true, protection:'active', mode:'prototype', app: env.APP_NAME || 'ScamGuard' });
    if (url.pathname === '/api/calls') return json({ calls: demoCalls });
    if (url.pathname === '/api/simulate-call') {
      return json({ call: demoCalls[0], decision:'blocked', message:'Simulerat samtal analyserat. Högrisk: blockerades och anhörig varnas.' });
    }
    if (url.pathname === '/api/routing') return json({
      unknown_calls:'screen_first', contacts:'pass_through', high_risk:'block_and_alert_family', uncertain:'ask_family_or_user', integrations:{ telephony:'mock', ai:'mock', sms:'mock' }
    });
    return env.ASSETS.fetch(request);
  }
};
