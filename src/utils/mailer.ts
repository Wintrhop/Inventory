import nodemailer from "nodemailer";
import { IUser } from "../api/Users/User.model";
const mail = process.env.MAIL_USER as string;
const password = process.env.MAIL_PASSWORD as string;

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const verify = async (transporter: any) => {
  const connection = await transporter.verify();

  if (connection) {
    console.log("Server is ready to take our messages");
  }
};
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

export const welcome = (user: any, password: string) => {
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

export const projectCreated = (user: any, name: string, startDate: string) => {
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
