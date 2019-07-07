const randomCard = () => {
    let words = ['fucking insane.','bartek-like.',`czolgu's beach.`,`for dummies.`,
                 'pretty shit.', `the cure for my cancer.`, `the reason i die.`, `my cum iniciator.`,
                 'my destiny.', 'completely fooked up.', 'my dreams come true.',`my mom's dildo.`,`my girlfriend's new boyfriend.`];
    return words[Math.floor(Math.random() * words.length)];  
} 

export default randomCard;