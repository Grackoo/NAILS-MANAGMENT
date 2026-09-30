const fs = require('fs');
let code = fs.readFileSync('src/components/client/BookingFlow.tsx', 'utf8');
const lines = code.split(/\r?\n/);

const goodStr = "      let waMessage = \¡Hola L'Atelier Vernis! He reservado una nueva cita:\\n\\n\ +
        \📅 Fecha: \\\n\ +
        \⏰ Hora: \\\n\ +
        \💅 Servicio: \\\n\ +
        \👤 Especialista: \\\n\ +
        \🙋‍♀️ A nombre de: \\\n\ +
        \📞 Teléfono: \\\n\ +
        (clientNotes.trim() ? \📝 Notas: \\\n\ : '') +
        \\\n¡Gracias!\;

      if (isFirstBooking) {
        const rawPhone = clientPhone.replace('+52', '').trim();
        const generatedUser = clientPhone.trim();
        const generatedPwd = clientName.trim().split(' ')[0].toLowerCase() + rawPhone.slice(-4);
        const superLink = window.location.origin + \?autoLogin=\ + encodeURIComponent(clientPhone.trim());
        waMessage += \\\n\\n🔑 *Mis Accesos al Portal VIP (Para mis próximas citas):*\\n\ +
          \Usuario: \\\n\ +
          \Contraseña: \\\n\ +
          \Superlink de acceso directo: \\\n\ +
          \(Este enlace me permitirá entrar directo sin poner contraseña, guárdenlo en mi registro por favor.)\;
      }
      
      const waUrl = \https://wa.me/527711960057?text=\\;
      window.open(waUrl, '_blank');
    }, 600);";

const newLines = lines.slice(0, 159);
const restLines = lines.slice(184);

const finalLines = [...newLines, ...goodStr.slice(1,-1).split(/\r?\n/), ...restLines];
fs.writeFileSync('src/components/client/BookingFlow.tsx', finalLines.join('\n'), 'utf8');