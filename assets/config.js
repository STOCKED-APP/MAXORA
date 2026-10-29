// Configurazione pubblica di Maxora (chiave "publishable": è sicura nel browser,
// i permessi veri sono nelle regole RLS del database).
window.MAXORA_CONFIG = {
  supabaseUrl: 'https://rplepprrnvabbhhpjcse.supabase.co',
  supabaseKey: 'sb_publishable_taJqR87W3AmrAps0eh8UEA_N7eYgvTs',
  mapStyles: {
    light: 'https://tiles.openfreemap.org/styles/positron',   // OpenFreeMap: gratis, senza chiave, uso commerciale ok
    dark: 'https://tiles.openfreemap.org/styles/dark'
  },
  version: '0.8.0'
};
