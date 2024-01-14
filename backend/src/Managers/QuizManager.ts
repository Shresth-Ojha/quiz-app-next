import { AllowedSubmission, Quiz } from '../Quiz';
import { IoManager } from './IoManager';

let globalProblemId = 0;

export class QuizManager {
    public quizes: Quiz[];

    constructor() {
        this.quizes = [];
    }

    public start(roomId: string) {
        const io = IoManager.getIo();
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.start();
    }

    public addProblem(
        roomId: string,
        problem: {
            title: string;
            description: string;
            image?: string;
            answer: AllowedSubmission;
            options: {
                title: string;
                id: number;
            }[];
        }
    ) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        console.log('adding problem from backend');
        quiz.addProblem({
            ...problem,
            startTime: new Date().getTime(),
            submissions: [],
            problemId: (globalProblemId++).toString(),
        });
        console.log('problem added from backend');
    }

    public next(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.next();
    }

    public addUser(roomId: string, name: string) {
        return this.getQuiz(roomId)?.addUser(name);
    }

    public submit(
        userId: string,
        roomId: string,
        problemId: string,
        submission: 0 | 1 | 2 | 3
    ) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.submit(userId, problemId, submission);
    }

    public getQuiz(roomId: string) {
        return this.quizes.find((x) => x.roomId === roomId) ?? null;
    }

    public getCurrentState(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return null;
        }
        return quiz.getCurrentState();
    }

    public addQuiz(roomId: string) {
        if (this.getQuiz(roomId)) {
            return;
        }
        const quiz = new Quiz(roomId);
        this.quizes.push(quiz);
    }
}
