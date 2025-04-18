require('dotenv').config();
const chavePrivada = process.env.CHAVE_JWT || '';
const jwt = require('jsonwebtoken');
const Usuario = require('../model/usuario.js');
const bcrypt = require('bcrypt');

exports.autenticar = (req, res, next) => {
  const token = req.headers['authorization'];

  jwt.verify(token, chavePrivada, (erro, informacoesUsuario) => {
    if (erro)
      return res.status(401).send({ msg: 'Token inválido ou expirado!' });
    next();
  });
}

exports.logar = async (req, res, next) => {
  /*const usuario = req.headers.usuario;
  const senha = req.headers.senha;*/

  const { usuario, senha } = req.headers;

  const usuarioBD = await Usuario.findOne({ usuario: usuario });
  if (!usuarioBD)
    return res.status(400).send({ msg: 'Usuário não existe' });

  const senhaCorreta = await bcrypt.compare(senha, usuarioBD.senha);
  if (senhaCorreta) {
    delete usuarioBD._id;
    delete usuarioBD.senha;

    jwt.sign(usuarioBD.toJSON(), chavePrivada, { expiresIn: '1d' }, (erro, token) => {
      if (erro)
        return res.status(500).send({ msg: 'Erro ao gerar JWT!' });
      res.status(200).send({ token: token });
    });
  } else {
    res.status(401).send({ msg: 'Usuário ou Senha errados!' });
  }
}