import { useState, useEffect } from 'react';
import { Table, Pagination, TextInput, Button, Title, Loader, Group, Badge } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export function Profile() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async (pageNum = 1, searchTerm = '') => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/users', {
        params: { page: pageNum, limit: 10, search: searchTerm }
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      console.log('only admins');
    }
    setLoading(false);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers(page, search);
    }
  }, [page, search]);

  if (user?.role !== 'admin') {
    return <Title>Profile (User view)</Title>;
  }

  return (
    <>
      <Title>Admin Panel - Users ({total})</Title>
      
      <Group mt="md">
        <TextInput
          placeholder="Search email..."
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
          leftSectionPointerEvents="none"
          style={{ flex: 1 }}
        />
      </Group>

      {loading ? (
        <Loader />
      ) : (
        <>
          <Table striped highlightOnHover mt="md">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td><Badge>{u.role}</Badge></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            mt="lg"
          />
          <Button onClick={() => handleLogout()}>Logout</Button>
        </>
        
      )}
    </>
  );
}
