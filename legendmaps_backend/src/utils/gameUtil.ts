export const generateGame = (gameJson: any) => {
    return {
        tokenId: gameJson.tokenId,
        test_val: "this is a test",
    };
};

export const characterBaseHPCalculator = (gameData: any, input: string) => {
    const moveIsValid = true;

    if (!moveIsValid) {
        return null;
    }

    if (gameData) {
        return {
            test_val: input,
        };
    }

    return null;
};
