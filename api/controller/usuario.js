const Usuario = require('../model/usuario.js');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async (req, res) => {
  const usuario = req.headers.usuario;
  const senha = req.headers.senha;
  const email = req.headers.email;

  if (!usuario || !senha || !email)
    return res.status(400).send({ msg: '[ERRO]: Informe usuario, senha e email!' });

  try {
    const usuarioJahExiste = await Usuario.findOne({ usuario: usuario });
    if (usuarioJahExiste) {
      return res.status(400).send({ msg: '[ERRO]: usuário já cadastrado!' });
    }

    const senhaEncriptada = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      usuario: usuario,
      email: email,
      senha: senhaEncriptada
    }

    await Usuario.create(novoUsuario);
    res.status(200).send({ msg: '[SUCESSO]: Usuário criado!', usuario: novoUsuario });
  } catch (erro) {
    console.log(erro);
    res.status(500).send({ msg: '[ERRO]: Erro ao registrar usuário', detalhes: erro });
  }
}