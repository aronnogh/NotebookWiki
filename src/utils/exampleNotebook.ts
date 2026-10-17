export const EXAMPLE_NOTEBOOK = {
  nbformat: 4,
  nbformat_minor: 5,
  metadata: {
    kernelspec: {
      display_name: "Python 3",
      language: "python",
      name: "python3"
    },
    language_info: {
      name: "python",
      version: "3.11.0",
      mimetype: "text/x-python",
      file_extension: ".py"
    },
    title: "The Monty Hall Problem",
    subtitle: "A probabilistic analysis of the famous game show paradox"
  },
  cells: [
    {
      cell_type: "markdown",
      metadata: {},
      source: [
        "# The Monty Hall Problem\n",
        "\n",
        "The **Monty Hall problem** is a famous probability puzzle based on the American television game show "
        + "*Let's Make a Deal*. It is named after the show's original host, **Monty Hall**. The problem is a "
        + "veridical paradox — the correct result is so counterintuitive that it can seem absurd, but is "
        + "nevertheless demonstrably true."
      ]
    },
    {
      cell_type: "markdown",
      metadata: {},
      source: [
        "## The Problem\n",
        "\n",
        "Suppose you're on a game show, and you're given the choice of three doors:\n",
        "\n",
        "- Behind one door is a **car**.\n",
        "- Behind the other two doors are **goats**.\n",
        "\n",
        "You pick a door, say Door 1, and the host, who knows what's behind the doors, opens another door, "
        + "say Door 3, which has a goat. He then says to you, *\"Do you want to pick Door 2?\"* "
        + "Is it to your advantage to switch your choice?"
      ]
    },
    {
      cell_type: "markdown",
      metadata: {},
      source: [
        "## The Solution\n",
        "\n",
        "Yes — you should switch! Switching gives you a **2/3** probability of winning the car, while "
        + "staying with your original choice gives only **1/3**.\n",
        "\n",
        "The key insight is that the host's action of revealing a goat provides **additional information**. "
        + "When you initially pick a door, you have a 1/3 chance of being right and a 2/3 chance of being "
        + "wrong. The host always reveals a goat from the remaining doors, so if you were wrong (2/3 "
        + "probability), switching will always win."
      ]
    },
    {
      cell_type: "markdown",
      metadata: {},
      source: [
        "## Simulation\n",
        "\n",
        "Let's verify this with a **Monte Carlo simulation** — running the game thousands of times and "
        + "tracking the win rates for both strategies."
      ]
    },
    {
      cell_type: "code",
      metadata: {},
      execution_count: 1,
      source: [
        "import random\n",
        "\n",
        "def play_monty_hall(switch: bool) -> bool:\n",
        "    \"\"\"Play one round of the Monty Hall problem.\n",
        "    Returns True if the player wins the car.\"\"\"\n",
        "    doors = [0, 1, 2]\n",
        "    car = random.choice(doors)\n",
        "    choice = random.choice(doors)\n",
        "\n",
        "    # Host opens a door that is not the car and not the player's choice\n",
        "    revealed = random.choice([d for d in doors if d != car and d != choice])\n",
        "\n",
        "    if switch:\n",
        "        choice = [d for d in doors if d != choice and d != revealed][0]\n",
        "\n",
        "    return choice == car"
      ],
      outputs: []
    },
    {
      cell_type: "code",
      metadata: {},
      execution_count: 2,
      source: [
        "# Run 100,000 simulations\n",
        "N = 100_000\n",
        "\n",
        "switch_wins = sum(play_monty_hall(switch=True) for _ in range(N))\n",
        "stay_wins = sum(play_monty_hall(switch=False) for _ in range(N))\n",
        "\n",
        "print(f\"Switching: won {switch_wins}/{N} = {switch_wins/N:.1%}\")\n",
        "print(f\"Staying:   won {stay_wins}/{N} = {stay_wins/N:.1%}\")"
      ],
      outputs: [
        {
          output_type: "stream",
          name: "stdout",
          text: [
            "Switching: won 66694/100000 = 66.7%\n",
            "Staying:   won 33287/100000 = 33.3%\n"
          ]
        }
      ]
    },
    {
      cell_type: "markdown",
      metadata: {},
      source: [
        "## Mathematical Proof\n",
        "\n",
        "Using **Bayes' theorem**, we can formalize the argument. Let $C_i$ be the event that the car is "
        + "behind door $i$, and let $H_i$ be the event that the host opens door $i$.\n",
        "\n",
        "$$P(C_1) = \\frac{1}{3}, \\quad P(C_2) = \\frac{1}{3}, \\quad P(C_3) = \\frac{1}{3}$$\n",
        "\n",
        "If the player picks door 1 and the host opens door 3, then:\n",
        "\n",
        "$$P(H_3 | C_1) = \\frac{1}{2}, \\quad P(H_3 | C_2) = 1, \\quad P(H_3 | C_3) = 0$$\n",
        "\n",
        "By Bayes' theorem:\n",
        "\n",
        "$$P(C_2 | H_3) = \\frac{P(H_3 | C_2) \\cdot P(C_2)}{P(H_3)} = "
        + "\\frac{1 \\cdot \\frac{1}{3}}{\\frac{1}{2} \\cdot \\frac{1}{3} + 1 \\cdot \\frac{1}{3} + 0} = "
        + "\\frac{2}{3}$$\n",
        "\n",
        "Therefore, switching to door 2 gives a **2/3** probability of winning."
      ]
    },
    {
      cell_type: "markdown",
      metadata: {},
      source: [
        "## Visualizing the Results\n",
        "\n",
        "Let's create a simple bar chart to compare the two strategies:"
      ]
    },
    {
      cell_type: "code",
      metadata: {},
      execution_count: 3,
      source: [
        "results = {'Stay': stay_wins / N, 'Switch': switch_wins / N}\n",
        "print(f\"{'Strategy':<10} {'Win Rate':>10}\")\n",
        "print(f\"{'-'*22}\")\n",
        "for strategy, rate in results.items():\n",
        "    bar = '█' * int(rate * 30)\n",
        "    print(f\"{strategy:<10} {rate:>9.1%} {bar}\")"
      ],
      outputs: [
        {
          output_type: "stream",
          name: "stdout",
          text: [
            "Strategy    Win Rate\n",
            "----------------------\n",
            "Stay          33.3% ██████████\n",
            "Switch        66.7% ████████████████████\n"
          ]
        }
      ]
    },
    {
      cell_type: "markdown",
      metadata: {},
      source: [
        "## Conclusion\n",
        "\n",
        "The Monty Hall problem beautifully illustrates how human intuition can fail when reasoning about "
        + "probability. The simulation confirms what the mathematics proves:\n",
        "\n",
        "| Strategy | Win Probability |\n",
        "|----------|----------------|\n",
        "| Stay     | 33.3%          |\n",
        "| Switch   | 66.7%          |\n",
        "\n",
        "The problem has been the subject of much debate, including a famous 1990 column by **Marilyn vos "
        + "Savant** in *Parade* magazine, in which she correctly answered that switching is the better "
        + "strategy — despite receiving thousands of letters from readers (including PhDs) insisting she "
        + "was wrong.\n",
        "\n",
        "### Key Takeaways\n",
        "\n",
        "1. **Always switch** — it doubles your odds of winning.\n",
        "2. The host's knowledge matters — they are not opening doors randomly.\n",
        "3. Simulations can help verify counterintuitive mathematical results."
      ]
    }
  ]
};
