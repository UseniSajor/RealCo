import * as React from 'react';
import { apiClient } from '../../lib/apiClient';

type Offering = { id: string; name: string; status: string; regulation_mode: string };

export function OfferingsPage() {
  const [items, setItems] = React.useState<Offering[]>([]);
  const [name, setName] = React.useState('');
  const [mode, setMode] = React.useState<'506b' | '506c' | 'internal'>('internal');
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await apiClient.get('/offerings');
    setItems(res.data.items);
  }

  async function createOffering() {
    setError(null);
    try {
      await apiClient.post('/offerings', { name, regulation_mode: mode });
      setName('');
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Failed');
    }
  }

  React.useEffect(() => { load().catch(() => void 0); }, []);

  return (
    <div>
      <h2>Offerings</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New offering name"
        />
        <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
          <option value="internal">Internal</option>
          <option value="506b">506(b)</option>
          <option value="506c">506(c)</option>
        </select>
        <button onClick={createOffering} disabled={!name.trim()}>Create</button>
      </div>

      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <table cellPadding={6} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Mode</th>
            <th align="left">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(o => (
            <tr key={o.id}>
              <td>{o.name}</td>
              <td>{o.regulation_mode}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
