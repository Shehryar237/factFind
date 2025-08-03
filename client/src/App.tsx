import { useState } from "react";
import styles from './App.module.css';
export default function App() {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState<string | null>(null);

  const handleCheck = async () => {
    setLabel(null);
    if (!/^https?:\/\/.+/.test(url)) {
      return alert("Enter a valid http:// or https:// URL");
    }

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || res.statusText);
      }
      const data = await res.json();
      setLabel(data.label);
    } 
    catch (e: any) {
      alert("Error: " + e.message);
      console.error(e);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerBar}><span style={{color:"darkblue"}}>factFind.</span></div>
      <div className={styles.pageContent}>
        <p className={styles.intro}>
          Think you’ve spotted a <span style={{ color: 'red' }}>fake</span> story?<br></br> Paste its 
          link below and let <strong>factFind</strong> unmask the <span style={{ color: 'green' }}>truth</span>
        </p>
        <div className={styles.inputSection}>
          <input
            type="url"
            placeholder="Paste article URL…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={styles.urlInput}
            required
            pattern="https?://.+"
          />
          <button onClick={handleCheck} className={styles.checkButton}>
            <span>Verify</span>
          </button>
        </div>
      </div>
       {label && (<div className={
                    label === 'Unreliable'
                      ? `${styles.verdict} ${styles.unreliableVerdict}`
                      : styles.verdict
                  }>
                  {label==='Reliable'&&(
                    <>
                      <h2>Verdict: <span style={{color: 'green'}}>{label}</span></h2>   
                      <p>This article appears <strong>reliable</strong> and can be trusted.<br>
                        </br>
                        It shows no signs of misinformation.
                      </p>
                    </>
                  )}
                  {label==='Unreliable'&&(
                    <>
                      <h2>Verdict: <span style={{color: 'red'}}>{label}</span></h2>   
                      <p>This article appears <strong>unreliable</strong> and should be treated with caution.<br>
                        </br>
                        Consider verifying its
                        claims before sharing.
                      </p>
                      <span className={styles.methodologyLink}><a href="">How do we decide this?</a></span>
                    </>
                  )}
                </div>
                ) 
        }
      <footer className={styles.footer}>
    © {new Date().getFullYear()} factFind. All rights reserved.
    <div className={styles.credit}>
      Powered by <a href="https://github.com/codelucas/newspaper" target="_blank" rel="noopener">newspaper3k</a>
    </div>
  </footer>
    </div>
  );
}
