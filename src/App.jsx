import React, { useMemo, useState } from "react";

const CATEGORIES = [
  "Housing (Rent/Mortgage)",
  "Groceries",
  "Dining & Coffee",
  "Transportation",
  "Phone/Internet",
  "Subscriptions",
  "Shopping",
  "Health & Beauty",
  "Utilities",
  "Entertainment",
  "Gifts/Donations",
  "Travel",
  "Other",
];

const PAYMENT_METHODS = ["Credit Card", "Debit", "Cash", "Transfer"];

function toCSV(rows, headers) {
  const escape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];
  return lines.join("\n");
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [incForm, setIncForm] = useState({
    date: "",
    source: "",
    type: "Paycheck",
    amount: "",
    notes: "",
  });

  const [expForm, setExpForm] = useState({
    date: "",
    description: "",
    category: CATEGORIES[0],
    paymentMethod: PAYMENT_METHODS[0],
    amount: "",
    notes: "",
  });

  const totals = useMemo(() => {
    const inc = income.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const exp = expenses.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    return { inc, exp, net: inc - exp };
  }, [income, expenses]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Finance.Chic Budget App (MVP)</h1>
      <p>
        Log income + expenses → export CSVs you can import into your Excel
        tracker.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          <h2>Income</h2>

          <input
            placeholder="YYYY-MM-DD"
            value={incForm.date}
            onChange={(e) => setIncForm({ ...incForm, date: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          />
          <input
            placeholder="Source (e.g., NBC)"
            value={incForm.source}
            onChange={(e) => setIncForm({ ...incForm, source: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          />
          <input
            placeholder="Type (e.g., Paycheck)"
            value={incForm.type}
            onChange={(e) => setIncForm({ ...incForm, type: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          />
          <input
            placeholder="Amount"
            value={incForm.amount}
            onChange={(e) => setIncForm({ ...incForm, amount: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          />
          <input
            placeholder="Notes (optional)"
            value={incForm.notes}
            onChange={(e) => setIncForm({ ...incForm, notes: e.target.value })}
            style={{ width: "100%", marginBottom: 12, padding: 10 }}
          />

          <button
            onClick={() => {
              if (!incForm.date || !incForm.amount) return;
              setIncome((prev) => [...prev, incForm]);
              setIncForm({
                date: "",
                source: "",
                type: "Paycheck",
                amount: "",
                notes: "",
              });
            }}
            style={{ width: "100%", padding: 12, cursor: "pointer" }}
          >
            Add Income
          </button>
        </div>

        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          <h2>Expense</h2>

          <input
            placeholder="YYYY-MM-DD"
            value={expForm.date}
            onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          />
          <input
            placeholder="Description"
            value={expForm.description}
            onChange={(e) =>
              setExpForm({ ...expForm, description: e.target.value })
            }
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          />

          <select
            value={expForm.category}
            onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={expForm.paymentMethod}
            onChange={(e) =>
              setExpForm({ ...expForm, paymentMethod: e.target.value })
            }
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            placeholder="Amount"
            value={expForm.amount}
            onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: 10 }}
          />
          <input
            placeholder="Notes (optional)"
            value={expForm.notes}
            onChange={(e) => setExpForm({ ...expForm, notes: e.target.value })}
            style={{ width: "100%", marginBottom: 12, padding: 10 }}
          />

          <button
            onClick={() => {
              if (!expForm.date || !expForm.amount) return;
              setExpenses((prev) => [...prev, expForm]);
              setExpForm({
                date: "",
                description: "",
                category: CATEGORIES[0],
                paymentMethod: PAYMENT_METHODS[0],
                amount: "",
                notes: "",
              });
            }}
            style={{ width: "100%", padding: 12, cursor: "pointer" }}
          >
            Add Expense
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2>Dashboard</h2>
        <p>
          <b>Total Income:</b> ${totals.inc.toFixed(2)} &nbsp; | &nbsp;
          <b>Total Spending:</b> ${totals.exp.toFixed(2)} &nbsp; | &nbsp;
          <b>Net Left:</b> ${totals.net.toFixed(2)}
        </p>

        <button
          onClick={() =>
            downloadText(
              "Income_Log.csv",
              toCSV(income, ["date", "source", "type", "amount", "notes"])
            )
          }
          style={{ padding: 10, cursor: "pointer" }}
        >
          Export Income CSV
        </button>

        <button
          style={{ marginLeft: 8, padding: 10, cursor: "pointer" }}
          onClick={() =>
            downloadText(
              "Expense_Log.csv",
              toCSV(expenses, [
                "date",
                "description",
                "category",
                "paymentMethod",
                "amount",
                "notes",
              ])
            )
          }
        >
          Export Expense CSV
        </button>
      </div>
    </div>
  );
}
