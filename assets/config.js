// Configurazione pubblica di Maxora (chiave "publishable": è sicura nel browser,
// i permessi veri sono nelle regole RLS del database).
window.MAXORA_CONFIG = {
  supabaseUrl: 'https://rplepprrnvabbhhpjcse.supabase.co',
  supabaseKey: 'sb_publishable_taJqR87W3AmrAps0eh8UEA_N7eYgvTs',
  mapStyles: {
    light: 'https://tiles.openfreemap.org/styles/liberty',    // OpenFreeMap a colori: gratis, senza chiave, uso commerciale ok
    dark: 'https://tiles.openfreemap.org/styles/liberty',     // stessa mappa, ricolorata per la notte (vedi nightStyle in app.js)
    labels: 'https://tiles.openfreemap.org/styles/dark'       // solo per le scritte sopra il satellite
  },
  // email pubblica per privacy e aiuto (pagine privacy.html e support.html, e Store)
  contactEmail: '',
  version: '0.28.2'
};
