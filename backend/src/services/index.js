import { createAuthService } from './auth.js';
import { createCatalogoAdminService } from './catalogo-admin.js';
import { createCatalogoService } from './catalogo.js';
import { createComprovanteService } from './comprovante.js';
import { createPainelService } from './painel.js';
import { createPedidosService } from './pedidos.js';
import { createQrCodeService } from './qr-code.js';
import { createTokenService } from './tokens.js';

export function createServices({ repositories, jwtSecret, mailer }) {
  const qrCode = createQrCodeService();
  const tokens = createTokenService(jwtSecret);
  const comprovante = createComprovanteService({ mailer, pedidos: repositories.pedidos, qrCode });

  return {
    auth: createAuthService({ usuarios: repositories.usuarios, tokens }),
    pedidos: createPedidosService({ ...repositories, comprovante, qrCode }),
    catalogo: createCatalogoService(repositories),
    catalogoAdmin: createCatalogoAdminService(repositories),
    painel: createPainelService(repositories),
  };
}
