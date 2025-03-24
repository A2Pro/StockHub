'use client';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function StockLessons() {
  const lessons = [
    {
      title: "Lesson 1: Introduction to Stocks",
      content: `Stocks represent ownership in a company. When you purchase a share of a company, you are buying a small piece of that company, also known as equity. As a shareholder, you have the potential to benefit from the company's growth and profitability. Companies issue stocks to raise money for expansion, operations, or other business needs.

Investing in stocks means you are betting on the company’s future success. If the company performs well, its stock price typically rises, increasing the value of your investment. Conversely, if the company struggles, the stock price can fall. This is why understanding a company before investing is crucial.

Public companies are listed on stock exchanges like the New York Stock Exchange (NYSE) or NASDAQ. These platforms allow investors to buy and sell shares easily.

Stocks are typically categorized into two main types: common and preferred. Common stocks offer voting rights at shareholder meetings and potential dividends, while preferred stocks prioritize dividend payments but usually lack voting rights. Understanding this distinction helps investors choose the type of stock that aligns with their financial goals.

In addition, companies may issue different classes of stock that confer varying levels of control or financial benefits. These classifications are vital for investors analyzing company structures and potential influence on decision-making processes.`,
      questions: [
        { q: "What does owning a stock represent?", options: ["Ownership in a company", "A loan to the company", "Government backing", "Fixed interest payments"], correct: 0 },
        { q: "Where are public company stocks traded?", options: ["Real estate agencies", "Stock exchanges", "Bank branches", "Government offices"], correct: 1 }
      ],
      diagram: "Stock ownership breakdown, common vs. preferred chart"
    },
    {
      title: "Lesson 2: How Stocks Make Money",
      content: `Stocks generate returns through two main ways: capital gains and dividends. Capital gains occur when you buy a stock at a lower price and sell it at a higher price. Dividends are portions of a company’s profits paid regularly to shareholders. Not all companies pay dividends, especially high-growth companies that reinvest profits back into growth.

Investors also benefit from stock appreciation driven by market demand, company performance, and economic growth. Long-term investors often aim to combine both income (dividends) and capital growth in their portfolios.`,
      questions: [
        { q: "What are the two primary ways stocks generate returns?", options: ["Dividends and capital gains", "Loans and debts", "Taxes and subsidies", "Fees and penalties"], correct: 0 },
        { q: "Which companies typically reinvest profits?", options: ["Startups", "High-growth companies", "Government agencies", "Banks"], correct: 1 }
      ],
      diagram: "Pie chart of capital gains vs dividends"
    },
    {
      title: "Lesson 3: Understanding Stock Market Risks",
      content: `Investing in stocks involves risks at multiple levels including market risk and company-specific risk. Market risk is the possibility of an overall market downturn impacting most stocks. Company-specific risk arises from poor management decisions, financial instability, or regulatory changes.

Diversifying investments across sectors, regions, and asset classes reduces risk exposure. External factors like political events, economic cycles, and interest rates also influence market risks.`,
      questions: [
        { q: "What is a common way to reduce risk?", options: ["Buy one stock", "Diversify investments", "Invest only in crypto", "Avoid all markets"], correct: 1 },
        { q: "What is market risk?", options: ["Company-specific issues", "Overall stock market decline", "Risk of losing your bank account", "Government taxes"], correct: 1 }
      ],
      diagram: "Risk pyramid chart"
    },
    {
      title: "Lesson 4: Stock Market Basics and Indexes",
      content: `The stock market includes exchanges like NYSE and NASDAQ where investors buy and sell shares. Indexes like the S&P 500, Dow Jones, and NASDAQ Composite track the performance of selected groups of stocks and represent the market’s general health.

Index funds allow investors to buy a slice of the entire market. These funds help diversify portfolios and are widely used in passive investing strategies to match the market’s return rather than beating it.`,
      questions: [
        { q: "What does the S&P 500 represent?", options: ["500 government projects", "500 U.S. large companies", "500 startup ideas", "500 bonds"], correct: 1 },
        { q: "What is the purpose of a stock index?", options: ["Predict weather", "Track performance of groups of stocks", "Calculate taxes", "Print money"], correct: 1 }
      ],
      diagram: "Bar chart comparing Dow Jones, S&P 500, NASDAQ"
    },
    {
      title: "Lesson 5: Long-Term Investing and Patience",
      content: `Successful stock investing requires patience and discipline. Time in the market often beats timing the market. Long-term investors ride out market volatility and benefit from compound growth over years.

Strategies like dollar-cost averaging—investing fixed amounts regularly—help smooth out market fluctuations. Emotional control is key to avoid selling during downturns and missing potential recoveries.`,
      questions: [
        { q: "Why is long-term investing important?", options: ["Guarantees profit", "Avoids taxes", "Rides out volatility", "Eliminates fees"], correct: 2 },
        { q: "What is dollar-cost averaging?", options: ["Invest a fixed amount regularly", "Buy only cheap stocks", "Follow stock tips", "Sell high buy low"], correct: 0 }
      ],
      diagram: "Line graph showing long-term growth vs short-term volatility"
    }
  ];

  const [step, setStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [graded, setGraded] = useState(false);

  const restartCourse = () => {
    setStep(0);
    setQuestionIndex(0);
    setSelected(-1);
    setGraded(false);
  };

  const safeStep = Math.max(0, Math.min(step, lessons.length));

  if (step === lessons.length) {
    return (
      <div className="w-full min-h-screen bg-white text-black p-10" style={{ backgroundColor: '#f5f0ff' }}>
        <div className="max-w-4xl mx-auto p-8 space-y-8 border-2 border-black rounded-lg shadow-2xl text-center">
          <h1 className="text-4xl font-bold text-green-700">🎉 Course Completed! 🎉</h1>
          <p className="text-lg">Congratulations on finishing the Intro to Stocks course. You're now better equipped to understand the stock market and make informed investing decisions.</p>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white mt-4" onClick={restartCourse}>Restart Course</Button>
        </div>
      </div>
    );
  }

  const currentLesson = lessons[safeStep];
  const currentQuestion = currentLesson.questions[questionIndex];

  return (
    <div className="w-full min-h-screen bg-white text-black p-10" style={{ backgroundColor: '#f5f0ff' }}>
      <div className="max-w-4xl mx-auto p-8 space-y-8 border-2 border-black rounded-lg shadow-2xl">
        <Progress className="bg-purple-300" value={((safeStep) / lessons.length) * 100} />
        <p className="font-semibold">Progress: {Math.round(((safeStep) / lessons.length) * 100)}%</p>

        <h1 className="text-3xl font-bold text-black">{currentLesson.title}</h1>

        <p
          className="text-lg text-black whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: currentLesson.content.replace(
              /\b(Stocks|equity|NYSE|NASDAQ|dividends|capital gains|risk|diversification|S&P 500|Dow Jones|NASDAQ Composite|long-term|dollar-cost averaging)\b/g,
              '<strong>$1</strong>'
            ),
          }}
        />

        <div className="text-center py-4">
          <div className="border border-purple-300 rounded-lg p-4 bg-purple-50 shadow-md">
            <p className="text-purple-700 italic">{currentLesson.diagram}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-semibold text-purple-600">{currentQuestion.q}</p>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value={index}
                checked={selected === index}
                onChange={() => {
                  setSelected(index);
                  setGraded(false);
                }}
                className="accent-purple-500"
              />
              <label className="text-black">{option}</label>
            </div>
          ))}

          {graded && (
            <p className={selected === currentQuestion.correct ? "text-green-600" : "text-red-600"}>
              {selected === currentQuestion.correct ? "Correct!" : "Incorrect. Please review the lesson content."}
            </p>
          )}

          <Button className="bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setGraded(true)}>
            Check Answer
          </Button>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white"
            onClick={() => {
              if (questionIndex > 0) {
                setQuestionIndex(questionIndex - 1);
              } else {
                setStep((prev) => Math.max(prev - 1, 0));
                setQuestionIndex(lessons[Math.max(step - 1, 0)].questions.length - 1);
              }
              setSelected(-1);
              setGraded(false);
            }}
            disabled={safeStep === 0 && questionIndex === 0}
          >
            Back
          </Button>

          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white"
            onClick={() => {
              if (questionIndex < currentLesson.questions.length - 1) {
                setQuestionIndex(questionIndex + 1);
              } else {
                setStep((prev) => prev + 1);
                setQuestionIndex(0);
              }
              setSelected(-1);
              setGraded(false);
            }}
          >
            {questionIndex < currentLesson.questions.length - 1 ? "Next Question" : "Next Lesson"}
          </Button>
        </div>
      </div>
    </div>
  );
}


