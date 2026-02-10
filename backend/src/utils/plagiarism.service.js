const checkPlagiarism = async (filePath) => {
    // Mock logic: return a random percentage between 0 and 30
    // In a real app, this would call an external API like Turnitin or Copyleaks
    return new Promise((resolve) => {
        setTimeout(() => {
            const score = Math.floor(Math.random() * 30);
            resolve(score);
        }, 1000);
    });
};

module.exports = { checkPlagiarism };
