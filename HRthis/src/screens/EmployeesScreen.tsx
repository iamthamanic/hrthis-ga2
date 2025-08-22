import React, { useEffect, useMemo, useState } from 'react';
import { useEmployeeStore } from '../state/employees';
import { useAuthStore } from '../state/auth';
import apiClient from '../api/api-client';
import { useNavigate } from 'react-router-dom';

export const EmployeesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { employees, setEmployees, deleteEmployee, isLoading } = useEmployeeStore();
  const { token, user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [sortByNameAsc, setSortByNameAsc] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await apiClient.employees.getAll(token);
        setEmployees(list);
      } catch (e) {
        console.error('Fehler beim Laden der Mitarbeiter', e);
      }
    })();
  }, [setEmployees, token]);

  const filtered = useMemo(() => {
    let list = employees || [];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(e => `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase().includes(q));
    }
    if (department) {
      list = list.filter(e => (e.department || '').toLowerCase() === department.toLowerCase());
    }
    if (status) {
      list = list.filter(e => (e.employmentStatus || '') === status);
    }
    list = [...list].sort((a, b) => {
      const an = `${a.lastName || ''} ${a.firstName || ''}`.trim();
      const bn = `${b.lastName || ''} ${b.firstName || ''}`.trim();
      return sortByNameAsc ? an.localeCompare(bn) : bn.localeCompare(an);
    });
    return list;
  }, [employees, query, department, status, sortByNameAsc]);

  if (isLoading) {
    return <div> Lade Mitarbeiter... </div>;
  }

  const onDelete = async (id: string) => {
    if (!window.confirm('Möchten Sie diesen Mitarbeiter wirklich löschen?')) return;
    await apiClient.employees.delete(id, token);
    deleteEmployee(id);
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input placeholder="Suche nach Name" value={query} onChange={e => setQuery(e.target.value)} />
        <select aria-label="Abteilung" value={department} onChange={e => setDepartment(e.target.value)}>
          <option value="">Alle Abteilungen</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
        </select>
        <select aria-label="Status" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Alle Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        <button onClick={() => setSortByNameAsc(s => !s)}>Sortieren</button>
        {user?.role === 'ADMIN' && (
          <button onClick={() => navigate('/employees/new')}>Mitarbeiter hinzufügen</button>
        )}
        <button onClick={() => {
          const csv = ['Name,Email'];
          filtered.forEach(e => csv.push(`${(e.firstName || '') + ' ' + (e.lastName || '')},${e.email || ''}`));
          const blob = new Blob(['\ufeff' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'employees.csv'; a.click();
        }}>Exportieren</button>
      </div>

      {filtered.length === 0 ? (
        <div>Keine Mitarbeiter gefunden</div>
      ) : (
        <ul>
          {filtered.map(e => (
            <li key={e.id} className="flex gap-2 items-center">
              <span data-testid="employee-name">{`${e.firstName || ''} ${e.lastName || ''}`.trim()}</span>
              {user?.role === 'ADMIN' && (
                <>
                  <button onClick={() => navigate(`/employees/${e.id}/edit`)}>Bearbeiten</button>
                  <button onClick={() => onDelete(e.id)}>Löschen</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeesScreen;

