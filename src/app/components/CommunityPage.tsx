import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopNav } from './TopNav';
import { useApp } from '../context/AppContext';

const battleQuestions = [
  { q: "What does the 'len()' function return in Python?", opts: ["The largest element", "The number of items", "The last index", "The data type"], correct: 1 },
  { q: "Which keyword starts a function definition in Python?", opts: ["function", "func", "def", "define"], correct: 2 },
  { q: "What is the output of: print(type([]))?", opts: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"], correct: 1 },
  { q: "Which method adds an element to the end of a list?", opts: ["insert()", "add()", "append()", "push()"], correct: 2 },
  { q: "What does the 'range(5)' function generate?", opts: ["1 to 5", "0 to 5", "0 to 4", "1 to 4"], correct: 2 },
];

const opponents = [
  { name: 'Aisha M.', bg: '#e879f9', initial: 'A', pts: 920, rank: 1 },
  { name: 'Liam K.', bg: '#60a5fa', initial: 'L', pts: 885, rank: 2 },
  { name: 'Mei L.', bg: '#34d399', initial: 'M', pts: 790, rank: 4 },
];

const lbData = [
  { rank: 'gold', name: 'Aisha M.', initial: 'A', bg: '#e879f9', score: '920 pts' },
  { rank: 'silver', name: 'Liam K.', initial: 'L', bg: '#60a5fa', score: '885 pts' },
  { rank: 'bronze', name: 'Gibran (You)', initial: 'G', bg: 'linear-gradient(135deg,#FB923C,#F472B6)', score: '', isYou: true, highlight: true },
  { rank: 'normal', name: 'Mei L.', initial: 'M', bg: '#34d399', score: '790 pts' },
  { rank: 'normal', name: 'Carlos R.', initial: 'C', bg: '#fbbf24', score: '755 pts' },
  { rank: 'normal', name: 'Sara T.', initial: 'S', bg: '#a78bfa', score: '720 pts' },
  { rank: 'normal', name: 'Ryan P.', initial: 'R', bg: '#fb7185', score: '695 pts' },
];

export function CommunityPage() {
  const { playerTotalScore, setPlayerTotalScore, feedItems, setFeedItems } = useApp();
  const [battleState, setBattleState] = useState<'idle' | 'active' | 'result'>('idle');
  const [selectedOpp, setSelectedOpp] = useState<typeof opponents[0] | null>(null);
  const [battleQIdx, setBattleQIdx] = useState(0);
  const [yourScore, setYourScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [selectedBattleOpt, setSelectedBattleOpt] = useState<number | null>(null);
  const [battleAnswered, setBattleAnswered] = useState(false);
  const [battleOptStates, setBattleOptStates] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [streak, setStreak] = useState(0);

  const countdownRef = useRef<number | null>(null);
  const stateRef = useRef({ battleQIdx: 0, battleAnswered: false, yourScore: 0, oppScore: 0 });

  // Keep refs in sync
  stateRef.current = { battleQIdx, battleAnswered, yourScore, oppScore };

  const selectOpponent = (opp: typeof opponents[0]) => setSelectedOpp(opp);

  const startBattle = () => {
    if (!selectedOpp) return;
    setBattleState('active');
    setBattleQIdx(0);
    setYourScore(0);
    setOppScore(0);
    setSelectedBattleOpt(null);
    setBattleAnswered(false);
    setBattleOptStates([]);
    setStreak(0);
    setCountdown(10);
  };

  const advanceBattle = useCallback((finalYour: number, finalOpp: number) => {
    const idx = stateRef.current.battleQIdx;
    if (idx >= battleQuestions.length - 1) {
      const won = finalYour > finalOpp;
      const tied = finalYour === finalOpp;
      let pts = 2;
      if (won) pts = 15;
      else if (tied) pts = 5;
      setPlayerTotalScore(prev => prev + pts);

      const oppName = selectedOpp?.name || 'Opponent';
      const resultText = won
        ? `won a Quiz Battle against <strong>${oppName}</strong> (${finalYour}\u2013${finalOpp})`
        : tied
        ? `drew with <strong>${oppName}</strong>`
        : `lost a close Quiz Battle to <strong>${oppName}</strong>`;

      setFeedItems(prev => [{
        avatar: 'G',
        bg: 'linear-gradient(135deg,#FB923C,#F472B6)',
        content: `<strong>You</strong> ${resultText}.`,
        time: 'Just now',
      }, ...prev]);

      setBattleState('result');
    } else {
      setBattleQIdx(prev => prev + 1);
      setSelectedBattleOpt(null);
      setBattleAnswered(false);
      setBattleOptStates([]);
    }
  }, [selectedOpp, setPlayerTotalScore, setFeedItems]);

  const handleTimeUp = useCallback(() => {
    if (stateRef.current.battleAnswered) return;
    setBattleAnswered(true);
    const q = battleQuestions[stateRef.current.battleQIdx];
    const states = q.opts.map((_, i) => i === q.correct ? 'correct' : 'disabled');
    setBattleOptStates(states);
    setStreak(0);

    let newOppScore = stateRef.current.oppScore;
    if (Math.random() < 0.7) newOppScore++;
    setOppScore(newOppScore);

    setTimeout(() => advanceBattle(stateRef.current.yourScore, newOppScore), 1200);
  }, [advanceBattle]);

  // Countdown timer
  useEffect(() => {
    if (battleState === 'active' && !battleAnswered) {
      setCountdown(10);
      countdownRef.current = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            countdownRef.current = null;
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [battleState, battleQIdx, battleAnswered, handleTimeUp]);

  const selectBattleOpt = (idx: number) => {
    if (battleAnswered) return;
    setSelectedBattleOpt(idx);
  };

  const submitBattleAnswer = () => {
    if (battleAnswered || selectedBattleOpt === null) return;
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }

    setBattleAnswered(true);
    const q = battleQuestions[battleQIdx];
    const correct = selectedBattleOpt === q.correct;
    const states = q.opts.map((_, i) => {
      if (i === selectedBattleOpt && correct) return 'correct';
      if (i === selectedBattleOpt && !correct) return 'wrong';
      if (i === q.correct && !correct) return 'correct';
      return 'disabled';
    });
    setBattleOptStates(states);

    let newYourScore = yourScore;
    let newOppScore = oppScore;
    if (correct) { newYourScore++; setStreak(prev => prev + 1); }
    else { setStreak(0); }
    if (Math.random() < 0.7) newOppScore++;
    setYourScore(newYourScore);
    setOppScore(newOppScore);

    setTimeout(() => advanceBattle(newYourScore, newOppScore), 1200);
  };

  const resetBattle = () => {
    setBattleState('idle');
    setSelectedOpp(null);
    setSelectedBattleOpt(null);
    setBattleAnswered(false);
    setBattleOptStates([]);
    setStreak(0);
  };

  const letters = ['A', 'B', 'C', 'D'];
  const won = yourScore > oppScore;
  const tied = yourScore === oppScore;
  const streakFontSize = Math.min(0.85 + streak * 0.12, 1.4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <TopNav activeLink="community" />
      <div style={{ padding: 36 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }} className="anim">Community</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.88rem', marginBottom: 28 }} className="anim d1">Challenge peers, climb the leaderboard, and stay motivated together.</p>

        <div className="community-grid">
          {/* Quiz Battle */}
          <div className={`comm-panel anim d2 ${battleState === 'active' ? 'battle-intense' : ''}`}>
            <div className="comm-panel-header">
              <h3>⚔️ Quiz Battle</h3>
              <span style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>
                {battleState === 'active' ? 'LIVE BATTLE' : 'Challenge a peer to a head-to-head quiz'}
              </span>
            </div>

            {battleState === 'idle' && (
              <div>
                <p style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginBottom: 14 }}>Select an opponent to battle:</p>
                <div className="battle-opponents">
                  {opponents.map(opp => (
                    <div key={opp.name} className={`battle-opp ${selectedOpp?.name === opp.name ? 'selected' : ''}`} onClick={() => selectOpponent(opp)}>
                      <div className="lb-av" style={{ background: opp.bg, width: 36, height: 36, fontSize: 14 }}>{opp.initial}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '.85rem' }}>{opp.name}</div>
                        <div style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>{opp.pts} pts · #{opp.rank}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" disabled={!selectedOpp} onClick={startBattle} style={{ marginTop: 14 }}>Start Battle →</button>
              </div>
            )}

            {battleState === 'active' && selectedOpp && (
              <div>
                <div className="battle-header-strip">
                  <div className="battle-player">
                    <div className="lb-av" style={{ background: 'linear-gradient(135deg,#FB923C,#F472B6)', width: 32, height: 32, fontSize: 12 }}>G</div>
                    <span>You</span>
                    <span className="battle-score">{yourScore}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>VS</div>
                    {streak > 0 && (
                      <div className="battle-streak" style={{ fontSize: `${streakFontSize}rem`, padding: `${4 + streak * 2}px ${12 + streak * 3}px` }}>
                        🔥 {streak} Streak!
                      </div>
                    )}
                  </div>
                  <div className="battle-player">
                    <div className="lb-av" style={{ background: selectedOpp.bg, width: 32, height: 32, fontSize: 12 }}>{selectedOpp.initial}</div>
                    <span>{selectedOpp.name.split(' ')[0]}</span>
                    <span className="battle-score">{oppScore}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <div className={`battle-countdown ${countdown <= 3 ? 'urgent' : ''}`}>{countdown}</div>
                  <div style={{ fontSize: '.66rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>SECONDS REMAINING</div>
                </div>

                <div className="battle-progress-text">Question {battleQIdx + 1} of {battleQuestions.length}</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 500, marginBottom: 14, textAlign: 'center' }}>
                  {battleQuestions[battleQIdx].q}
                </p>
                <div className="qp-opts">
                  {battleQuestions[battleQIdx].opts.map((opt, i) => (
                    <div
                      key={i}
                      className={`qp-opt ${selectedBattleOpt === i && !battleAnswered ? 'selected' : ''} ${battleOptStates[i] || ''}`}
                      onClick={() => selectBattleOpt(i)}
                      style={battleAnswered ? { pointerEvents: 'none', opacity: battleOptStates[i] === 'disabled' ? 0.5 : 1 } : undefined}
                    >
                      <span className="qp-letter" style={
                        battleOptStates[i] === 'correct' ? { background: 'var(--emerald)', color: 'white' } :
                        battleOptStates[i] === 'wrong' ? { background: 'var(--rose)', color: 'white' } : undefined
                      }>{letters[i]}</span>
                      {opt}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" disabled={selectedBattleOpt === null || battleAnswered} onClick={submitBattleAnswer} style={{ marginTop: 12 }}>
                  Submit Answer
                </button>
              </div>
            )}

            {battleState === 'result' && selectedOpp && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 52, marginBottom: 10 }}>{won ? '🏆' : tied ? '🤝' : '😤'}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 6 }}>{won ? 'Victory!' : tied ? "It's a Draw!" : 'Defeat!'}</h3>
                <p style={{ fontSize: '.82rem', color: 'var(--text-secondary)', marginBottom: 18 }}>
                  {won ? `You beat ${selectedOpp.name}! +15 points added.` : tied ? `Evenly matched with ${selectedOpp.name}. +5 each.` : `${selectedOpp.name} wins this round. Keep going!`}
                </p>
                <div className="battle-final-scores">
                  <div className="battle-final-p">
                    <div className="bfp-name">You</div>
                    <div className="bfp-score" style={{ color: won ? 'var(--emerald)' : 'var(--text-primary)' }}>{yourScore}</div>
                  </div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', alignSelf: 'center' }}>—</div>
                  <div className="battle-final-p">
                    <div className="bfp-name">{selectedOpp.name}</div>
                    <div className="bfp-score" style={{ color: !won && !tied ? 'var(--emerald)' : 'var(--text-primary)' }}>{oppScore}</div>
                  </div>
                </div>
                <button className="btn-primary" onClick={resetBattle} style={{ marginTop: 16 }}>Play Again</button>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="comm-panel anim d3">
            <div className="comm-panel-header">
              <h3>🏅 Leaderboard</h3>
              <span style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>Refreshes every 60 seconds</span>
            </div>
            {lbData.map((l, i) => (
              <div key={i} className="lb-row" style={l.highlight ? { background: 'var(--violet-soft)', borderRadius: 8 } : undefined}>
                <div className={`lb-rank ${l.rank}`}>{i + 1}</div>
                <div className="lb-av" style={{ background: l.bg }}>{l.initial}</div>
                <div className={`lb-name ${l.isYou ? 'lb-you' : ''}`}>{l.name}</div>
                <div className="lb-score">{l.isYou ? `${playerTotalScore} pts` : l.score}</div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="comm-panel full-width anim d4">
            <div className="comm-panel-header">
              <h3>📢 Activity Feed</h3>
              <span style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>Updates within 5 seconds</span>
            </div>
            <div className="activity-feed">
              {feedItems.map((item, i) => (
                <div key={i} className="feed-item" style={i === 0 && item.time === 'Just now' ? { animation: 'fadeUp .4s var(--ease-out)' } : undefined}>
                  <div className="lb-av" style={{ background: item.bg, width: 28, height: 28, fontSize: 10, flexShrink: 0 }}>{item.avatar}</div>
                  <div className="feed-content" dangerouslySetInnerHTML={{ __html: item.content + `<span class="feed-time">${item.time}</span>` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
