import { Socket } from 'socket.io';
import { QuizManager } from './QuizManager';

const ADMIN_PASSWORD = 'ADMIN_PASSWORD';
export class UserManager {
    private quizmanager: QuizManager;

    constructor() {
        this.quizmanager = new QuizManager();
    }

    public addUser(socket: Socket) {
        //socketId -> randomly generated
        this.createHandlers(socket);
    }

    private createHandlers(socket: Socket) {
        socket.on('join', (data) => {
            console.log("to delete 1")
            const userId = this.quizmanager.addUser(data.roomId, data.name);
            socket.emit('init', {
                userId,
                state: this.quizmanager.getCurrentState(data.roomId), //for a user joining in between
            });
        });
        socket.on('joinAdmin', (data) => {
            console.log("to delete 2")
            if (data.password !== ADMIN_PASSWORD) {
                return;
            }
            console.log("hei from userManager joinAdmin");

            socket.on('createQuiz', (data) => {
                console.log("creating quiz ", data.roomId);
                this.quizmanager.addQuiz(data.roomId);
                console.log("quiz created ", data.roomId);
                console.log("quizes: ", this.quizmanager.quizes)
            });

            socket.on('createProblem', (data) => {
                this.quizmanager.addProblem(data.roomId, data.problem);
            });

            socket.on('start', (data) => {
                this.quizmanager.start(data.roomId);
            });

            socket.on('next', (data) => {
                this.quizmanager.next(data.roomId);
            });
        });

        socket.on('submit', (data) => {
            const userId = data.userId;
            const roomId = data.roomId;
            const problemId = data.problemId;
            const submission = data.submission;

            if (
                submission != 0 &&
                submission != 1 &&
                submission != 2 &&
                submission != 3
            ) {
                console.error('issue while getting input ' + submission);
                return;
            }

            this.quizmanager.submit(userId, roomId, problemId, submission);
        });
    }
}
