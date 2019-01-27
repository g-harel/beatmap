import {pull} from "./pull";

const main = async () => {
    await pull(new Date("January 1, 2018"), new Date("February 1, 2018"), (play) => {
        console.log(JSON.stringify(play));
    });
};

main();
