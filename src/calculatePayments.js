export function calculatePayments (loanAmount, interestRate, remainingPayments, overPayments) {
    const monthlyInterestRate = interestRate / 1200;
    
    const payments = [];

  
    for (let i = 1; i <= remainingPayments; i++) {
      const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -(remainingPayments-i+1)));
      const interestPayment = loanAmount * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      let overpayment = 0;
      if (overPayments !== undefined) {
        overpayment = Number(overPayments['OP'+i]) || 0
      }
      
      const balance = loanAmount - principalPayment - overpayment;
      const payment = {
        paymentNumber: i,
        paymentAmount: monthlyPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        overpayment: overpayment.toFixed(2),
        balance: balance.toFixed(2)
      };
      payments.push(payment);
      loanAmount = balance;
      if (loanAmount < 0) { break }
      
    }
  
    return payments;
  }

  export function calculateMothlyPayment(loanAmount, interestRate, remainingPayments) {
    const monthlyInterestRate = interestRate / 1200; // dzienny podzielony na 30 dni
    const denominator = 1 - Math.pow(1 + monthlyInterestRate, -remainingPayments);
    const monthlyPayment = (loanAmount * monthlyInterestRate) / denominator;
    return monthlyPayment;
  }



