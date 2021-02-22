import express from 'express'

const app = express();

/* Possíveis funções:
 *
 * GET => Buscar
 * POST => Salvar
 * PUT => Alterar
 * DELETE => Deletar
 * PATCH => Alteração específica
 */


// http://localhost:3333/
app.get("/", (request, response) => {
    return response.json({ message: "Hello word - NLW04" });
});

// 1 parâ => Rota(Recurso API)
// 2 parâ => request, response

app.post("/", (request, response)  =>{
    //Recebeu os dados para salvar
    return response.json({message: "Os dados foram salvos com sucesso"});
});

app.listen(3333, () => console.log("Server is running!"));