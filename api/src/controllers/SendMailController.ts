import { Response, Request } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import SendEmailService from "../services/SendEmailService";
import { resolve } from "path";

class SendMailController {

    async execute(request: Request, response: Response){

        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await usersRepository.findOne({email});
        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey)
        return response.status(400).json({
            error:"Survey does not exist"
        });

        if(!user)
            return response.status(400).json({
                error:"User does not exist"
            });  

        const variables = {
            name: user.name,
            user_id: user.id,
            title: survey.title,
            description: survey.description,
            link: process.env.URL_MAIL
        };

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
            where: [{user_id: user.id}, {value: null}],
            relations: ["user", "survey"]
        });

        if(surveyUserAlreadyExist){
            await SendEmailService.execute(email, survey.title, variables, npsPath)
            return response.json(surveyUserAlreadyExist);
        }

        //Save informations in the table surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });
        await surveysUsersRepository.save(surveyUser);

        //Send mail to user
        await SendEmailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController }