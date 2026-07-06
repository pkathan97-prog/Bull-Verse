// BullVerse India Community Board Management

window.CommunityBoard = {
    // 1. Upvote a post
    likePost: function(postId) {
        const posts = window.BullVerseData.community.posts;
        const post = posts.find(p => p.id === parseInt(postId));
        if (post) {
            post.likes += 1;
            return post.likes;
        }
        return 0;
    },

    // 2. Submit a new post
    createPost: function(authorName, text, stockTag = "GENERAL") {
        const posts = window.BullVerseData.community.posts;
        const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
        const newPost = {
            id: newId,
            author: authorName || "Anonymous Bull",
            avatar: (authorName || "AN").split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2),
            badge: "Retail Investor",
            content: text,
            stockTag: stockTag.toUpperCase().replace("$", ""),
            likes: 0,
            comments: 0,
            time: "Just now"
        };
        posts.unshift(newPost);
        return newPost;
    },

    // 3. Cast a vote on a poll
    votePoll: function(pollId, optionIndex) {
        const polls = window.BullVerseData.community.polls;
        const poll = polls.find(p => p.id === parseInt(pollId));
        if (poll) {
            poll.votes[optionIndex] += 1;
            
            // Calculate total votes and percentages
            const total = poll.votes.reduce((a, b) => a + b, 0);
            const percentages = poll.votes.map(v => ((v / total) * 100).toFixed(1));
            
            return {
                votes: poll.votes,
                total: total,
                percentages: percentages
            };
        }
        return null;
    }
};

console.log("BullVerse community board handlers active.");
