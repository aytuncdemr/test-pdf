
export default function getDate(){

    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns month from 0-11, so add 1
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}