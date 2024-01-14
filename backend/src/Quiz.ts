import { IoManager } from './Managers/IoManager';

export type AllowedSubmission = 0 | 1 | 2 | 3;

const PROBLEM_TIME_S = 20;

interface User {
    name: string;
    id: string;
    points: number;
}

interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmission;
}

export interface Problem {
    problemId: string;
    title: string;
    description: string;
    startTime: number;
    image?: string;
    answer: AllowedSubmission; // 0, 1, 2, 3
    options: {
        title: string;
        id: number;
    }[];
    submissions: Submission[];
}

export class Quiz {
    public roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private currentState: 'leaderboard' | 'question' | 'not_started' | 'ended'; //*use ENUM here?

    constructor(roomId: string) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = 'not_started';

        console.log('room created');

        setInterval(() => {
            this.debug();
        }, 10000);
    }

    debug() {
        console.log('---debug---');
        console.log(this.roomId);
        console.log(JSON.stringify(this.problems));
        console.log(this.users);
        console.log(this.currentState);
        console.log(this.activeProblem);
    }

    public addProblem(problem: Problem) {
        this.problems.push(problem);
        console.log(
            'new problem added, roomId: ',
            this.roomId,
            ' problems: ',
            this.problems
        );
    }

    public setActiveProblem(problem: Problem) {
        this.currentState = 'question';
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        IoManager.getIo().emit('CHANGE_PROBLEM', { problem: problem });

        setTimeout(() => {
            this.sendLeaderboard();
        }, PROBLEM_TIME_S * 1000);
    }

    public sendLeaderboard() {
        this.currentState = 'leaderboard';
        const leaderboard = this.getLeaderboard();
        const io = IoManager.getIo();
        io.to(this.roomId).emit('LEADERBOARD', { leaderboard });
    }

    public start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
    }

    public next() {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        if (problem) {
            this.setActiveProblem(problem);
        } else {
            //send final results here
            this.currentState = "ended";
            IoManager.getIo().to(this.roomId).emit('QUIZ_END');
            this.hasStarted = false;
        }

    }

    public genRandomId(length: number) {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }

        return result;
    }

    public addUser(name: string) {
        const id = this.genRandomId(8);
        this.users.push({
            name,
            id,
            points: 0,
        });

        return id;
    }

    public submit(
        userId: string,
        problemId: string,
        submission: AllowedSubmission
    ) {
        const problem = this.problems.find((x) => x.problemId === problemId);
        const user = this.users.find((x) => x.id === userId);

        if (!problem || !user) {
            return;
        }

        const existingSubmission = problem.submissions.find(
            (x) => x.userId === userId
        );

        if (existingSubmission) {
            // can only submit once
            return;
        }

        problem.submissions.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected: submission,
        });

        user.points +=
            problem.answer === submission
                ? 1000 -
                  (500 * (new Date().getTime() - problem.startTime)) /
                      PROBLEM_TIME_S
                : 0;
    }

    public getLeaderboard() {
        return this.users
            .sort((a, b) => (a.points > b.points ? 1 : 0))
            .splice(0, 20);
    }

    public getCurrentState() {
        if (this.currentState === 'not_started') {
            return {
                type: 'not_started',
            };
        }
        if (this.currentState === 'ended') {
            return {
                type: 'ended',
                leaderboard: this.getLeaderboard(),
            };
        }
        if (this.currentState === 'leaderboard') {
            return {
                type: 'leaderboard',
                leaderboard: this.getLeaderboard(),
            };
        }
        if (this.currentState === 'question') {
            const problem = this.problems[this.activeProblem];
            return {
                type: 'question',
                problem,
            };
        }
    }
}
