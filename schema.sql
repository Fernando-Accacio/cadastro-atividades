-- --------------------------------------------------------
-- Servidor:                     ep-icy-forest-acnj7ii7-pooler.sa-east-1.aws.neon.tech
-- Versão do servidor:           PostgreSQL 17.5 (aa1f746) on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14+deb12u1) 12.2.0, 64-bit
-- OS do Servidor:               
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Copiando estrutura para tabela public.additional_info
CREATE TABLE IF NOT EXISTS "additional_info" (
	"id" SERIAL NOT NULL,
	"text" TEXT NOT NULL,
	PRIMARY KEY ("id"),
	KEY ("id")
);

-- Copiando dados para a tabela public.additional_info: -1 rows
/*!40000 ALTER TABLE "additional_info" DISABLE KEYS */;
INSERT INTO "additional_info" ("id", "text") VALUES
	(1, 'Curso Complementar
Gestão de Ameaças Cibernéticas - Senac
(Conhecimentos sobre segurança digital, identificação de vulnerabilidades e prevenção de ataques cibernéticos)');
/*!40000 ALTER TABLE "additional_info" ENABLE KEYS */;

-- Copiando estrutura para tabela public.contacts
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR NOT NULL,
	"email" VARCHAR NOT NULL,
	"message" TEXT NOT NULL,
	"timestamp" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	KEY ("id")
);

-- Copiando dados para a tabela public.contacts: -1 rows
/*!40000 ALTER TABLE "contacts" DISABLE KEYS */;
INSERT INTO "contacts" ("id", "name", "email", "message", "timestamp") VALUES
	(4, 'a', 'aaaaaaaaaaaaa@gmail.com', 'aa', '2025-11-05 02:34:17.47143+00');
/*!40000 ALTER TABLE "contacts" ENABLE KEYS */;

-- Copiando estrutura para tabela public.education
CREATE TABLE IF NOT EXISTS "education" (
	"id" SERIAL NOT NULL,
	"degree" VARCHAR NOT NULL,
	"institution" VARCHAR NOT NULL,
	"details" TEXT NULL DEFAULT NULL,
	"start_date" VARCHAR NOT NULL,
	"end_date" VARCHAR NOT NULL,
	PRIMARY KEY ("id"),
	KEY ("id")
);

-- Copiando dados para a tabela public.education: -1 rows
/*!40000 ALTER TABLE "education" DISABLE KEYS */;
INSERT INTO "education" ("id", "degree", "institution", "details", "start_date", "end_date") VALUES
	(2, 'Ensino Médio Técnico em Internet das Coisas (IoT)', 'Senac Nações Unidas', '5º lugar no projeto Empreenda Senac, demonstrando espírito empreendedor, criatividade e capacidade de
trabalho em equipe.', '02/2023', '12/2025');
/*!40000 ALTER TABLE "education" ENABLE KEYS */;

-- Copiando estrutura para tabela public.experiences
CREATE TABLE IF NOT EXISTS "experiences" (
	"id" SERIAL NOT NULL,
	"title" VARCHAR NOT NULL,
	"company" VARCHAR NOT NULL,
	"start_date" VARCHAR NOT NULL,
	"end_date" VARCHAR NULL DEFAULT NULL,
	"description" TEXT NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	KEY ("id")
);

-- Copiando dados para a tabela public.experiences: -1 rows
/*!40000 ALTER TABLE "experiences" DISABLE KEYS */;
/*!40000 ALTER TABLE "experiences" ENABLE KEYS */;

-- Copiando estrutura para tabela public.general_info
CREATE TABLE IF NOT EXISTS "general_info" (
	"id" SERIAL NOT NULL,
	"main_name" VARCHAR NULL DEFAULT NULL,
	"full_name" VARCHAR NULL DEFAULT NULL,
	"address" VARCHAR NULL DEFAULT NULL,
	"phone" VARCHAR NULL DEFAULT NULL,
	"email" VARCHAR NULL DEFAULT NULL,
	"responsible" VARCHAR NULL DEFAULT NULL,
	"profile_pic_url" VARCHAR NULL DEFAULT NULL,
	"pdf_url" VARCHAR NULL DEFAULT NULL,
	"objective" TEXT NULL DEFAULT NULL,
	"resume_summary" TEXT NULL DEFAULT NULL,
	"informal_intro" TEXT NULL DEFAULT NULL,
	"experience_fallback_text" TEXT NULL DEFAULT NULL,
	"show_education" BOOLEAN NOT NULL DEFAULT true,
	"show_skills" BOOLEAN NOT NULL DEFAULT true,
	"show_additional_info" BOOLEAN NOT NULL DEFAULT true,
	"linkedin_url" VARCHAR NULL DEFAULT NULL,
	"github_url" VARCHAR NULL DEFAULT NULL,
	"email_address" VARCHAR NULL DEFAULT NULL,
	"show_linkedin" BOOLEAN NULL DEFAULT true,
	"show_github" BOOLEAN NULL DEFAULT true,
	"show_email" BOOLEAN NULL DEFAULT true,
	PRIMARY KEY ("id"),
	KEY ("id")
);

-- Copiando dados para a tabela public.general_info: -1 rows
/*!40000 ALTER TABLE "general_info" DISABLE KEYS */;
INSERT INTO "general_info" ("id", "main_name", "full_name", "address", "phone", "email", "responsible", "profile_pic_url", "pdf_url", "objective", "resume_summary", "informal_intro", "experience_fallback_text", "show_education", "show_skills", "show_additional_info", "linkedin_url", "github_url", "email_address", "show_linkedin", "show_github", "show_email") VALUES
	(1, 'Marcelo Antony Accacio Olhier', 'Marcelo Antony Accacio Olhier', 'Rua Soldado PM Gilberto Augustinho, 237', '(11) 95314-1962', 'marceloaccacio9@gmail.com', '(11) 99997-6992', 'https://res.cloudinary.com/dax5ezkth/image/upload/v1762290531/perfil_portifolio/profile_pic.jpg', 'https://res.cloudinary.com/dax5ezkth/raw/upload/v1762280396/curriculo_pdf/curriculo', 'Meu nome é Marcelo Antony, tenho 18 anos e estou no terceiro ano do ensino médio. Sou uma pessoa curiosa e sempre em busca de aprender coisas novas. Atualmente, curso IoT (Internet das Coisas), pois me interesso muito por tecnologia e por como ela conecta o mundo de forma inteligente e inovadora.
Se quiser saber mais sobre mim, clique aqui →', 'Busco minha primeira oportunidade profissional em uma empresa que valorize o aprendizado, o
comprometimento e o desenvolvimento pessoal e técnico. Desejo aplicar meus conhecimentos adquiridos no
curso técnico em Internet das Coisas (IoT), contribuindo com entusiasmo, dedicação e vontade de aprender para
o sucesso da equipe e da organização.', 'Obrigado por se interessar e estar aqui! 
Bem, ano que vem pretendo entrar na faculdade de Gestão em TI, e talvez também fazer algum curso livre para continuar aprendendo e me aperfeiçoando. Quero arrumar um emprego e, claro, tirar minha CNH, que é uma das minhas metas pessoais.

Tenho muitos hobbies, mas vou citar alguns dos que mais gosto logo aqui embaixo. Também vou mostrar quem são as pessoas mais importantes pra mim: minha família e minha namorada — sim, eu namoro! Graças a Deus, no dia 13 de novembro completamos 1 ano de relacionamento, e isso é algo que me deixa muito feliz.

Enfim, aqui vou compartilhar um pouco mais sobre mim, com alguns registros e momentos especiais que fazem parte da minha história.', 'Em busca da primeira oportunidade de trabalho. Desejo ingressar no mercado para adquirir experiência prática,
colocar em uso meus conhecimentos técnicos e desenvolver novas habilidades que me ajudem a crescer
profissionalmente.', 'true', 'true', 'true', 'https://www.linkedin.com/in/marcelo-antony-741296363/', 'https://github.com/marceloaccacio9-netizen', 'marceloaccacio9@gmail.com', 'true', 'true', 'true');
/*!40000 ALTER TABLE "general_info" ENABLE KEYS */;

-- Copiando estrutura para tabela public.hobbies
CREATE TABLE IF NOT EXISTS "hobbies" (
	"id" SERIAL NOT NULL,
	"title" VARCHAR NOT NULL,
	"description" TEXT NOT NULL,
	"image_url" VARCHAR NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	KEY ("id")
);

-- Copiando dados para a tabela public.hobbies: -1 rows
/*!40000 ALTER TABLE "hobbies" DISABLE KEYS */;
INSERT INTO "hobbies" ("id", "title", "description", "image_url") VALUES
	(10, 'São Paulo Futebol Clube — Meu Time do Coração', 'O São Paulo Futebol Clube é mais do que um time pra mim, é uma parte da minha história. Já chorei, vibrei, gritei e comemorei muito por esse clube. É o time que faz meu coração bater mais forte a cada partida, mesmo quando o resultado não vem. Pra mim, é o melhor time do Brasil — um time de tradição, raça e garra, que sempre busca vencer de forma limpa e honesta, sem precisar de tramoia pra conquistar nada.

Minha paixão pelo Tricolor veio de família. Foi meu avô, Alcides Accacio, que infelizmente já faleceu, quem plantou essa semente em mim. Ele sempre falava do São Paulo com tanto orgulho que era impossível não se apaixonar também. Além dele, meu primo Fernando e o pai dele, meu tio Edson, ajudaram a fortalecer ainda mais esse amor pelo clube.

Sou muito feliz por ser são-paulino. Mesmo com as decepções de vez em quando — porque, né, quem torce sabe como é sofrer kkk — eu nunca deixo de acreditar. Ser torcedor do São Paulo é viver intensamente cada momento, é ter orgulho de um time gigante, de história, de conquistas e de coração. E, aconteça o que acontecer, sempre serei Tricolor de corpo e alma!', 'https://img.elo7.com.br/product/zoom/50C22DE/matriz-de-bordado-time-sao-paulo-futebol-clube-spfc-escudo.jpg'),
	(12, 'Minha Mãe katia', 'Essa é a minha mãe, Kátia. Uma mulher incrível, presente em cada passo da minha vida. Ela é o tipo de pessoa que não só está ao meu lado, mas realmente participa, se preocupa, aconselha e faz de tudo para me ver bem. Às vezes eu acho que estou diante de um problema impossível, daqueles que parecem não ter saída… e é exatamente nessas horas que ela aparece com calma, clareza e uma solução que eu jamais teria pensado.
Sou muito grato por tudo o que ela representa para mim. Pelo apoio incondicional, pelas conversas que me colocam no caminho certo, pela força que ela me passa mesmo quando eu estou fraco. Minha mãe é o tipo de pessoa que transforma tudo ao redor dela — com carinho, sensibilidade e uma sabedoria que só uma mãe de verdade tem.
Ela não é apenas minha mãe: é meu porto seguro, minha conselheira, minha inspiração. Se hoje eu sou quem eu sou, grande parte é graças a ela. E por isso, eu sempre vou carregar uma gratidão gigante dentro do coração.', 'https://res.cloudinary.com/dax5ezkth/image/upload/v1762826425/u99bezlxidwao8fupl4p.jpg'),
	(8, 'Minha namorada, Ana Karolini', 'Essa é a Ana Karolini, minha namorada, uma pessoa simplesmente incrível. Ela tem 18 anos e, por coincidência, faz aniversário no mesmo mês que eu — eu no dia 09/10 e ela no dia 31/10. Desde que entrou na minha vida, tudo ficou mais leve e especial. Sou muito grato por tudo o que ela faz por mim, pelo apoio constante, pelas palavras de incentivo e por acreditar em mim mesmo quando eu duvido de mim.

Encontrar a Ana nesse mundo tão difícil foi como achar um verdadeiro tesouro. Ela é batalhadora, esforçada, estudiosa, linda, responsável e sabe exatamente o que quer da vida. É um exemplo de mulher, um sonho que eu tenho a sorte de viver.

Sou imensamente feliz ao lado dela, e se Deus permitir, será com ela que vou construir minha família e realizar todos os meus planos.', 'https://res.cloudinary.com/dax5ezkth/image/upload/v1762821471/cwxe20glcuj9rcfck207.jpg'),
	(9, 'Meus primos, Fernando e Andressa', 'Meus primos, Fernando e Andressa, são pessoas muito especiais para mim. Sempre estiveram presentes na minha vida, e juntos vivemos momentos cheios de risadas, conversas e boas lembranças. Cada um deles tem um lugar único no meu coração.

O Fernando é mais que um primo — é como um irmão de outra mãe. Está sempre ao meu lado, me apoiando em tudo, rindo comigo e compartilhando cada resenha, cada jogo de futebol e nossas partidas inesquecíveis de FIFA 14. A gente se entende de um jeito que só quem tem uma amizade verdadeira sabe como é. Sou muito grato por tê-lo como primo e por ele ser essa pessoa incrível que é.

Já a Andressa, mesmo que nossa ligação não seja tão intensa quanto a minha com o Fernando, é uma pessoa que admiro muito. Cada momento que passo com ela fortalece ainda mais nosso laço. Ela é estudiosa, inteligente e sempre me inspira a seguir pelo caminho certo, guiado por Deus. Tenho certeza de que nossa conexão só vai crescer com o tempo, porque ela é alguém muito especial na minha vida.', 'https://res.cloudinary.com/dax5ezkth/image/upload/v1762822638/bec8bcvokyhdwpjuvi6a.jpg'),
	(11, 'Meu Pai, Marcelo', 'Esse é o meu pai — e sim, ele também se chama Marcelo (kkkk). Pra mim, ele é um pai perfeito. Claro que, como todo mundo, tem seus defeitos, mas nada disso muda o quanto eu o admiro e amo. Ele é um exemplo de homem, de caráter e de coração, e eu sou muito grato por tudo que aprendi e continuo aprendendo com ele.

Desde pequeno, meu pai me ensinou valores que levo pra vida toda: a respeitar as mulheres, a nunca desrespeitar ninguém, a ser humilde e agir sempre com o coração. Ele sempre me mostrou, mais com atitudes do que com palavras, o que é ser um homem de verdade — alguém que luta, que se dedica e que está sempre presente pra quem ama.

Com ele, aprendi que ser um “bom menino” (kkkk) não é ser perfeito, mas sim ter respeito, empatia e saber o valor das pessoas. Cada conselho, cada risada e até cada bronca dele têm um significado enorme pra mim.

Pai, eu te amo demais! Obrigado por tudo que você é e por tudo que representa na minha vida. Tenho muito orgulho de ser seu filho e de carregar o seu nome.', 'https://res.cloudinary.com/dax5ezkth/image/upload/v1762825276/ijc627kyt7fp3ngv9oiq.jpg'),
	(13, 'Meu Aquário', 'Esse é o meu aquário — um hobby que nasceu de um jeito inesperado e especial. Tudo começou no Dia dos Namorados, quando minha namorada me presenteou com um peixe betta. Dei a ele o nome de Jeff, e foi a partir desse pequeno companheiro que descobri um mundo totalmente novo. Desde então, comecei a estudar, pesquisar e me aprofundar cada vez mais nesse universo fascinante da aquarística.

Com o tempo, montei meu próprio aquário de 81 litros, com as medidas de 60x30x45, pensado com calma, cuidado e muita dedicação. Hoje, ele funciona como um aquário de pH alcalino, planejado para proporcionar o melhor ambiente possível. Cada planta, cada pedra, cada detalhe foi escolhido com carinho, porque esse aquário representa mais do que apenas um hobby — ele se tornou um refúgio, um espaço que transmite paz e conquista meu olhar todos os dias.

O som da água, o movimento tranquilo do Jeff nadando, a vida que existe dentro desse pequeno ecossistema… tudo isso acende uma paixão enorme dentro do meu coração. É algo que me inspira, me relaxa e me faz querer aprender cada vez mais. Montar esse aquário não foi só uma tarefa, foi uma experiência que despertou em mim uma paixão verdadeira, algo que hoje faz parte do meu dia e que eu pretendo levar para a vida.', 'https://res.cloudinary.com/dax5ezkth/image/upload/v1763311062/pwiykaga7pgjc4wo9xij.webp'),
	(14, 'Nina, Minha Companheira', 'Essa é a Nina, minha pastora alemã — minha amiga leal, minha parceira fiel e a presença que me acompanha em todos os momentos. Desde que ela chegou na minha vida, tudo ganhou um significado diferente. Eu a peguei quando ela tinha apenas 3 a 4 meses, esperei com paciência até que ela desmamasse para poder trazê-la para casa do jeito certo, com cuidado e responsabilidade. Desde então, criamos um laço tão forte que parece que ela sempre esteve ao meu lado.

A Nina é mais do que uma cadela; ela é companheirismo puro. Para onde eu vou, ela vai também, como se entendesse que nosso lugar é juntos. Ela percebe quando estou feliz, quando estou cansado e até quando preciso de companhia sem dizer nada — e nesses momentos ela está lá, com aquele olhar cheio de confiança e carinho.

Eu cuido muito dela, porque ela merece todo o amor do mundo. E, na verdade, cuidar dela nem parece um esforço — é uma alegria. Tenho um carinho imenso por ela, um amor enorme que só cresce com o tempo. A Nina é inteligente, protetora, brincalhona e cheia de personalidade. Cada dia com ela é especial, e cada momento ao lado dela reforça o quanto ela significa para mim.', 'https://res.cloudinary.com/dax5ezkth/image/upload/v1763314631/ua0crptuwfyej58kamky.webp');
/*!40000 ALTER TABLE "hobbies" ENABLE KEYS */;

-- Copiando estrutura para tabela public.projects
CREATE TABLE IF NOT EXISTS "projects" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR NOT NULL,
	"description" TEXT NOT NULL,
	"area_saber" VARCHAR NOT NULL,
	"materia" VARCHAR NOT NULL,
	"image_url" VARCHAR NULL DEFAULT NULL,
	"project_link" VARCHAR NULL DEFAULT NULL,
	"votes" INTEGER NOT NULL,
	PRIMARY KEY ("id"),
	KEY ("id")
);

-- Copiando dados para a tabela public.projects: -1 rows
/*!40000 ALTER TABLE "projects" DISABLE KEYS */;
INSERT INTO "projects" ("id", "name", "description", "area_saber", "materia", "image_url", "project_link", "votes") VALUES
	(1, 'boa', 'TESTE', 'TESTE', 'TESTE', 'https://res.cloudinary.com/dax5ezkth/image/upload/v1762300876/ugxxplyozsyt9ltwik5t.png', 'https://github.com/', 12);
/*!40000 ALTER TABLE "projects" ENABLE KEYS */;

-- Copiando estrutura para tabela public.skills
CREATE TABLE IF NOT EXISTS "skills" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR NOT NULL,
	"category" VARCHAR NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	KEY ("id")
);

-- Copiando dados para a tabela public.skills: -1 rows
/*!40000 ALTER TABLE "skills" DISABLE KEYS */;
INSERT INTO "skills" ("id", "name", "category") VALUES
	(3, 'Conhecimentos em Internet das Coisas (IoT) e tecnologias emergentes.', 'Técnica'),
	(4, 'Noções de redes, sensores e conectividade de dispositivos inteligentes.', 'Técnica'),
	(5, 'Habilidade em resolução de problemas, lógica e raciocínio analítico.', 'Técnica'),
	(6, 'Capacidade de organização e responsabilidade com prazos e metas.', 'Técnica'),
	(7, 'Facilidade para aprender e absorver novas informações rapidamente.', 'Soft Skill'),
	(8, 'Colaboração e trabalho em equipe, prezando sempre pelo respeito e boa comunicação.', 'Soft Skill'),
	(9, 'Proatividade e comprometimento em todas as tarefas atribuídas.', 'Soft Skill'),
	(10, 'Grande interesse em tecnologia, inovação e segurança da informação.', 'Soft Skill'),
	(11, 'Dedicação em dar o melhor desempenho possível em cada desafio.', 'Soft Skill'),
	(12, 'Disponibilidade para aprender, colaborar e crescer dentro da empresa.', 'Soft Skill'),
	(13, 'Perfil dinâmico, curioso e com forte interesse em tecnologia e inovação.', 'Soft Skill'),
	(14, 'Aberto a novos desafios e sempre disposto a evoluir profissionalmente.', 'Soft Skill'),
	(15, 'Português: Nativo', 'Idioma');
/*!40000 ALTER TABLE "skills" ENABLE KEYS */;

-- Copiando estrutura para tabela public.users
CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL NOT NULL,
	"username" VARCHAR NOT NULL,
	"password_hash" VARCHAR NOT NULL,
	PRIMARY KEY ("id"),
	UNIQUE ("username"),
	KEY ("id")
);

-- Copiando dados para a tabela public.users: -1 rows
/*!40000 ALTER TABLE "users" DISABLE KEYS */;
INSERT INTO "users" ("id", "username", "password_hash") VALUES
	(1, 'marcelo accacio', 'scrypt:32768:8:1$t8Qemf8HXXR3JIWn$1a1d82fbd5959a93f697594a51abd8973c6779e4eb726c75c9d6dc1f6aa295f1db74663e84c6a3cce2fe214e10ab1a177cb45f9506ae39342da4656e04cc3a7f');
/*!40000 ALTER TABLE "users" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;