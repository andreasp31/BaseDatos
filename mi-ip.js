const https = require('https');
const { exec } = require('child_process');

console.log('🌐 OBTENIENDO TU IP PÚBLICA ACTUAL\n');

// Opción 1: Usar servicio web
https.get('https://api.ipify.org?format=json', (resp) => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', () => {
        const ip = JSON.parse(data).ip;
        console.log('✅ TU IP PÚBLICA ES:', ip);
        console.log(`\n📋 AÑADE ESTA IP EN MONGODB ATLAS:`);
        console.log(`1. Ve a Network Access`);
        console.log(`2. Haz clic en "ADD IP ADDRESS"`);
        console.log(`3. Pega: ${ip}/32`);
        console.log(`4. Descripción: "Mi IP Actual"`);
        console.log(`5. Haz clic en "Confirm"`);
        console.log(`\n⚠️  O usa: 0.0.0.0/0 para todas las IPs`);
    });
}).on('error', () => {
    // Opción 2: Comando nativo
    exec('curl -s ifconfig.me', (err, stdout) => {
        if (!err && stdout) {
            console.log('✅ TU IP PÚBLICA ES:', stdout.trim());
        } else {
            console.log('❌ No se pudo obtener IP. Conéctate a internet.');
        }
    });
});