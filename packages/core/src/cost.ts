export function calculateCost(storage: number){
    // COME ON DUDE. THIS IS AWFUL.
    // if the user wants ten or fewer notes, we charge $4 per note
    // if the user wants 11-100 notes, we're charging $1 per note. 
    
    // we're multiplying the result by 100 because stripe takes the smallest unit of currency. 
    const rate = storage <= 10 ? 4 : storage <= 100 ? 2 : 1;
    return rate * storage * 100;
}