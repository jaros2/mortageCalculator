function calculateLoanPayment(loanAmount, interestRate, remainingPayments) {
    const monthlyInterestRate = interestRate / 1200; // dzienny podzielony na 30 dni
    const denominator = 1 - Math.pow(1 + monthlyInterestRate, -remainingPayments);
    const monthlyPayment = (loanAmount * monthlyInterestRate) / denominator;
    return monthlyPayment;
  }

  export default calculateLoanPayment
