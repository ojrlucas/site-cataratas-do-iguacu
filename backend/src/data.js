export const parque = {
  nome: 'Parque Nacional do Iguaçu',
  funcionamento: {
    aberturaDiaria: 'O Parque Nacional do Iguaçu abre todos os dias do ano.',
    horarios: [
      { dias: 'De segunda a sexta', horario: 'das 9h às 16h' },
      { dias: 'Sábado e domingos', horario: 'das 8h30 às 16h' },
    ],
  },
  estacionamento:
    'O parque oferece a conveniência de estacionamento terceirizado, administrado pela Indigo, visando garantir maior segurança e tranquilidade para os visitantes durante seus passeios. (botão desabilitado por ser website de estudos)',
  contato: {
    email: 'contato@catarataspni.com.br',
    telefone: '+55 (45) 3521-4400',
    whatsapp: '+55 (45) 3521-4438',
  },
  localizacao: {
    endereco: 'BR 469, Km 18, Parque Nacional do Iguaçu',
    cidade: 'Foz do Iguaçu / Paraná / Brasil',
    cep: '85.859-899',
  },
  redes: [
    { nome: 'Instagram', icone: 'bi-instagram', url: 'https://www.instagram.com/cataratasdoiguacu' },
    { nome: 'Facebook', icone: 'bi-facebook', url: 'https://www.facebook.com/cataratasdoiguacu/' },
    { nome: 'YouTube', icone: 'bi-youtube', url: 'https://www.youtube.com/channel/UCjygzVAlqTdRX13UZ3V1vzw/videos' },
  ],
};

export const atividades = [
  { id: 'barco', titulo: 'Passeio de barco', imagem: 'imagens/lazer-1.png', alt: 'Pessoas passeando de barco pelas Cataratas do Iguaçu',
    descricao: 'Sinta a emoção de navegar pelas águas do Rio Iguaçu e vivenciar a força e a beleza das famosas cataratas de uma perspectiva única e inesquecível. O passeio de barco leva você para bem perto das quedas, proporcionando um banho revigorante nas águas e uma visão espetacular da grandiosidade da natureza. Prepare-se para sentir a energia das quedas d\'água de perto, uma experiência que certamente será um dos pontos altos da sua visita ao Parque Nacional do Iguaçu.' },
  { id: 'bike', titulo: 'Passeio de bike', imagem: 'imagens/lazer-2.png', alt: 'Passeio de bike pelas trilhas do parque',
    descricao: 'Embarque em uma aventura sobre duas rodas e descubra a beleza que cerca as Cataratas do Iguaçu de uma perspectiva diferente e revigorante. Os passeios de bike oferecem a liberdade de explorar trilhas e caminhos em meio à exuberante natureza local, permitindo sentir o ar puro, observar a fauna e a flora de perto e chegar a mirantes com vistas panorâmicas espetaculares. Pedalar pela região é uma forma ativa e emocionante de se conectar com a paisagem, desvendando recantos escondidos e criando memórias inesquecíveis em meio a esse paraíso natural.' },
  { id: 'cataratas', titulo: 'Meio das Cataratas', imagem: 'imagens/lazer-3.png', alt: 'Passarela no meio das cataratas',
    descricao: 'Caminhar pela passarela que se estende "Meio das Cataratas" é uma jornada imersiva no coração pulsante dessa maravilha natural. Sinta a vibração da água ecoando sob seus pés enquanto você avança em direção ao rugido ensurdecedor e à cortina líquida que se descortina à sua frente. Essa perspectiva única permite contemplar a magnitude das quedas de ângulos impressionantes, oferecendo um contato íntimo com a força e a beleza selvagem do Iguaçu, uma experiência que aguça todos os sentidos e grava memórias duradouras.' },
  { id: 'visao', titulo: 'Visão aérea', imagem: 'imagens/lazer-4.png', alt: 'Vista aérea das Cataratas do Iguaçu',
    descricao: 'Subir no elevador e contemplar as Cataratas do Iguaçu de cima é como ganhar asas por um momento. A visão aérea revela a grandiosidade do cenário em toda a sua extensão, com o rio serpenteando entre a vegetação exuberante e as quedas d\'água formando um espetáculo hipnotizante. Do alto, a força da natureza se manifesta em padrões intrincados, e a imensidão do horizonte convida à contemplação, proporcionando uma perspetiva privilegiada dessa maravilha do mundo.' },
  { id: 'amanhecer', titulo: 'Amanhecer', imagem: 'imagens/lazer-5.png', alt: 'Amanhecer sobre as cataratas',
    descricao: 'À medida que os primeiros raios de sol começam a pintar o céu sobre a densa mata atlântica que emoldura as Cataratas do Iguaçu, um espetáculo de cores suaves e tons vibrantes anuncia um novo dia. O amanhecer traz consigo uma atmosfera de serenidade e magia, onde a névoa matinal dança sobre as águas despertando, revelando a beleza imponente das quedas sob uma luz dourada e suave. É um momento de paz e contemplação, onde a natureza parece despertar em sinfonia, oferecendo uma perspectiva única e inspiradora dessa maravilha natural antes que a agitação do dia comece.' },
  { id: 'por-sol', titulo: 'Pôr do sol', imagem: 'imagens/lazer-6.png', alt: 'Pôr do sol nas cataratas',
    descricao: 'À medida que o sol se despede do dia sobre as majestosas Cataratas do Iguaçu, o céu se inflama em tons vibrantes de âmbar, escarlate e púrpura. A névoa que emana das quedas captura essa paleta incandescente, pintando o cenário com pinceladas de luz dourada e sombras dançantes. O rugido das águas se mistura ao silêncio contemplativo do final da tarde, criando uma atmosfera mágica e efêmera. Contemplar o pôr do sol neste lugar icônico é presenciar um balé de cores e sons, uma despedida gloriosa do astro-rei que deixa uma marca indelével na alma.' },
];

// Valores fictícios (site de estudos)
export const tiposIngresso = [
  { id: 'inteira', nome: 'Inteira', precoCentavos: 10000, imagem: 'imagens/lazer-1.png',
    descricao: 'Ingresso de acesso ao Parque Nacional do Iguaçu, válido para o dia escolhido. Inclui o transporte interno do parque e o acesso às passarelas e mirantes das Cataratas do Iguaçu.' },
  { id: 'meia', nome: 'Meia-entrada', precoCentavos: 5000, imagem: 'imagens/lazer-3.png',
    descricao: 'Ingresso com 50% de desconto para estudantes, idosos, pessoas com deficiência e demais beneficiários previstos em lei. É obrigatório apresentar documento comprobatório na entrada do parque.' },
];
