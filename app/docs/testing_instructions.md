# How to Try the Healthcare Leadership Simulator

This guide explains how to test our leadership decision-making simulator, which is now designed to be accessible and engaging for high school students.

## Before You Start

You'll need:

1. An OpenAI API key (ask your teacher for this)
2. The API key saved in a file called `.env` as `OPENAI_API_KEY=your-key-here`
3. Node.js installed on your computer

## Starting the Simulator

1. Open a terminal or command prompt
2. Run `npm install` to set up the program
3. Run `npm run dev` to start the simulator
4. Open your web browser and go to `http://localhost:3000/test`

## Using the Leadership Decision Simulator

The simulator puts you in the role of a healthcare company CEO facing a challenging situation. Here's how to use it:

### Step 1: Learn About Your Challenge

- When the page loads, you'll see information about the situation you need to handle (a data breach)
- A coach will introduce themselves and explain the challenge in more detail
- They'll ask you the first question about what you would do

### Step 2: Make Decisions

- Type your answer in the text box at the bottom of the screen
- Be thoughtful about what you would do as the company's leader
- The coach will ask follow-up questions to help you think more deeply
- After a few follow-ups, the coach will move to the next main question
- There are three main questions to answer:
  1. How would you tell people about the data breach?
  2. What would you do to help the people affected?
  3. How would you handle responsibility for what happened?

### Step 3: Finish the Exercise

- After answering all three questions, you'll complete the exercise
- Click the "See How You Did" button to get feedback on your decisions

### Step 4: Review Your Feedback

- You'll receive scores on how ethical (doing what's right) and strategic (smart business thinking) your decisions were
- Read the feedback to understand your strengths and areas to improve
- Look at the real-world examples to see how actual leaders handled similar situations

## What to Notice

As you use the simulator, notice these things:

1. **Conversational language**: The coach talks to you like a person, not like a textbook
2. **Follow-up questions**: The coach asks questions directly related to your specific answers
3. **Real-world examples**: The feedback includes examples of how real leaders handled similar situations
4. **Helpful feedback**: The evaluation gives specific, constructive suggestions

## How This Works Behind the Scenes

This simulator uses AI in a clever way:

- Instead of having everything pre-written, it uses the AI's knowledge of leadership and ethics
- It only needs a small amount of information about the scenario
- It automatically creates follow-up questions based on what you say
- It compares your answers to principles of good leadership rather than to specific pre-written answers

## Having Problems?

If something doesn't work right:

1. Check the browser console for error messages (ask your teacher how)
2. Make sure your API key is correctly set up
3. Try refreshing the page or restarting the server
4. Ask for help if you get stuck!
