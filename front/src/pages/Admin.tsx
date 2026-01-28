import { useState, useEffect } from 'react';
import { Table, Pagination, TextInput, Select, Button, Title, Loader, Group } from '@mantine/core';
import axios from 'axios';
import { IconSearch } from '@tabler/icons-react';

interface User {
  id: number;
  email: string;
  createdAt: string;
}

export function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const limit = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/auth/users', {
        params: { page, limit, search, sortBy, sortOrder },
      });
      setUsers(data.users);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, sortBy, sortOrder]);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'email', title: 'Email' },
    { key: 'createdAt', title: 'Created' },
  ];

  return (
    <>
      <Title>Users Admin</Title>
      <TextInput
        leftSection={<IconSearch size={16} />}
        leftSectionPointerEvents="none"
        placeholder="Search by email or ID"
        mb="md"
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <Group mb="md">
        <Select
          label="Sort by"
          data={['id', 'email', 'createdAt']}
          value={sortBy}
          onChange={(value) => setSortBy(value || '')}
        />
        <Select
          label="Order"
          data={['ASC', 'DESC']}
          value={sortOrder}
          onChange={(value) => setSortOrder(value || 'DESC')}
        />
        <Button onClick={fetchUsers}>Refresh</Button>
      </Group>
      {loading ? <Loader /> : (
        <>
          <Table>
            <thead>
              <tr>{columns.map(col => <th key={col.key}>{col.title}</th>)}</tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination 
            total={Math.ceil(total / limit)} 
            value={page} 
            onChange={setPage} 
          />
        </>
      )}
    </>
  );
}
