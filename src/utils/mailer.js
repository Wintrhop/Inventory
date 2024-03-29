"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectCreated = exports.welcome = exports.verify = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});
const verify = (transporter) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield transporter.verify();
    if (connection) {
        console.log("Server is ready to take our messages");
    }
});
exports.verify = verify;
const styles = {
    box: `display:flex;
  justify-content: center;`,
    container: `width:30%;
  padding:15px;
  text-align: center;
  border-radius: 12px;
  border: 1px solid rgb(226, 224, 224);
  color: #2480af;
  `,
};
const welcome = (user, password) => {
    return {
        from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
        to: user.email,
        subject: "Bienvenido",
        html: `
    <div style="${styles.box}">
      <div style="${styles.container}">
          <h1> Bienvenido ${user.name}</h1>
          <p> ha sido creado su perfil para ingresar a ${process.env.ORG_NAME}. </p>
          <p> correo: ${user.email}</p>
          <p> contraseña:${password}</p>
        </div>
        </div>
        
      `,
        text: `Bienvenido ${user.name}`,
    };
};
exports.welcome = welcome;
const projectCreated = (user, name, startDate) => {
    return {
        from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
        to: `${user.email}, ${process.env.ADM_MAIL}`,
        subject: `Creacion de Projecto ${name}`,
        html: `
    <div style="${styles.box}">
      <div style="${styles.container}">
          <h1>Creacion de Projecto ${name}</h1>
          <p> ${user.email} ha creado un nuevo projecto. </p>
          <p> con fecha de inicio: ${startDate}</p>
        </div>
        </div>
        
      `,
        text: `Creacion de Projecto ${name}`,
    };
};
exports.projectCreated = projectCreated;
