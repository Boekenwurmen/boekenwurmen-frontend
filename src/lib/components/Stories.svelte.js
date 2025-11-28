export default class Stories {
    /**
     * 
     * @param bookId {number | null | undefined}
     * @param page {number | null | undefined}
     */
    static async getPageStory(bookId, page){
        return Stories._getPageStoryLocal(page);
    }

    /**
     * 
     * @param bookId {number | null | undefined}
     * @param page {number | null | undefined}
     */
    static async getPageOptions(bookId, page){
        return Stories._getPageOptionsLocal(page);
    }

    /**
     * 
     * @param page {number | null | undefined}
     */
    static _getPageStoryLocal(page){
        switch (page) {
            case 1: return "You walk through a sandy, windy desert. The wind blows sand in your eyes and you fall to the ground."
            case 2: return "You start screaming into the vast empthy desert. While screaming you feel yourself slowely sinking into the ground when all of a sudden you fall through the ground! You hit the ground hard and hurt yourself."
            case 3: return "As soon as you hit the ground you feel a wooden hatch beneath you. It feels old and rotten. Yet when you put your ear to the hatch you hear running water. As you hear the water your throat starts to dry up you have not drank anything for about a day..."
            case 4: return "You enter what seems to be a library with a bit of running water. You take a drink and start looking around but all the books you see you can't read..."
            
            case 5: return "As you wander further you become more and more thirsty and start seeing things that aren’t there... After five more hours of wandering in the heat of the desert you fall to the ground. You fall asleep not to wake up again... "
            case 6: return "As you look around you see the running water and take a sip. behind all the water you see a old library filled with books you can’t read..."
            case 7: return "You check your leg and see it bleeding. You rip off a piece of your shirt and after you clean the wound with the running water you see, you make a makeshift bandage. Now that you’ve treated your wound you start to look around and see an old library filled with books you can’t read...."
            // case 0: return ""
            default: return `This part of the story ${Math.random() < 0.5 ? 'went missing' : 'got burned up'}.`
        }
    }

    /**
     * 
     * @param page {number | null | undefined}
     */
    static _getPageOptionsLocal(page){
        switch (page) {
            case 1: return [
                {toPage:3, name:"You hit the ground out of frustation"},
                {toPage:2, name:"You scream in pain from the sand in your eyes"},
            ]
            case 2: return [
                {toPage:7, name:"Check yourself for wounds"},
                {toPage:6, name:"look around to see where you are"},
            ]
            case 3: return [
                {toPage:5, name:"You ignore the hatch and wander into the desert"},
                {toPage:4, name:"You open the hatch and go inside"},
            ]
            case 4: case 6: case 7: return [
                {toPage:0, name:"Enter library"},
            ]
            case 5: return [
                {toPage:1, name:"Go back"},
            ]
            // case 0: return [
            //     {toPage:2, name:""},
            //     {toPage:2, name:""},
            // ]
            default: return [
                {toPage:1, name:"Go back"},
            ]
        }
    }
}