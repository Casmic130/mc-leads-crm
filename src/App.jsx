import React, { useEffect, useState } from "react";
import "./App.css";

const emptyForm = {
  company: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  status: "Nueva",
};

export default function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedLeads = localStorage.getItem("mc_leads");
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mc_leads", JSON.stringify(leads));
  }, [leads]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveLead = (e) => {
    e.preventDefault();

    if (!form.company.trim()) {
      alert("Agrega el nombre de la compania.");
      return;
    }

    if (editId) {
      setLeads(
        leads.map((lead) =>
          lead.id === editId ? { ...form, id: editId } : lead
        )
      );
      setEditId(null);
    } else {
      setLeads([{ ...form, id: Date.now() }, ...leads]);
    }

    setForm(emptyForm);
  };

  const editLead = (lead) => {
    setForm({
      company: lead.company,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      notes: lead.notes,
      status: lead.status,
    });
    setEditId(lead.id);
  };

  const deleteLead = (id) => {
    const confirmDelete = window.confirm("Seguro que quieres borrar este lead?");
    if (confirmDelete) {
      setLeads(leads.filter((lead) => lead.id !== id));
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const clearAll = () => {
    const confirmClear = window.confirm("Seguro que quieres borrar todos los leads?");
    if (confirmClear) {
      setLeads([]);
      setForm(emptyForm);
      setEditId(null);
    }
  };

  const updateStatus = (id, status) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: status } : lead
      )
    );
  };

  const exportCSV = () => {
    const headers = [
      "Nombre de compania",
      "Nombre",
      "Email",
      "Telefono",
      "Direccion",
      "Notas",
      "Estado",
    ];

    const rows = leads.map((lead) => [
      lead.company,
      lead.name,
      lead.email,
      lead.phone,
      lead.address,
      lead.notes,
      lead.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((item) => `"${String(item || "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "mc-leads.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter((lead) => {
    const text = `
      ${lead.company}
      ${lead.name}
      ${lead.email}
      ${lead.phone}
      ${lead.address}
      ${lead.notes}
      ${lead.status}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <div className="logo-circle">MC</div>
          <div>
            <h1>MC Property Solutions</h1>
            <p>Leads CRM</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat blue">
            <span>Nueva</span>
            <strong>{leads.filter((lead) => lead.status === "Nueva").length}</strong>
          </div>

          <div className="stat gold">
            <span>Seguimiento</span>
            <strong>{leads.filter((lead) => lead.status === "Seguimiento").length}</strong>
          </div>

          <div className="stat green">
            <span>Cerrada</span>
            <strong>{leads.filter((lead) => lead.status === "Cerrada").length}</strong>
          </div>

          <div className="stat white">
            <span>Total Leads</span>
            <strong>{leads.length}</strong>
          </div>
        </div>
      </header>

      <section className="panel">
        <h2>{editId ? "Modificar Lead" : "Agregar Lead"}</h2>

        <form className="form" onSubmit={saveLead}>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Nombre de compania"
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefono"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Direccion"
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option>Nueva</option>
            <option>Seguimiento</option>
            <option>Cerrada</option>
          </select>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notas"
          />

          <div className="form-buttons">
            <button type="submit" className="btn primary">
              {editId ? "Guardar cambios" : "Agregar lead"}
            </button>

            {editId && (
              <button type="button" className="btn dark" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="tools">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por compania, nombre, email, telefono..."
          />

          <button type="button" className="btn gold-btn" onClick={exportCSV}>
            Exportar CSV
          </button>

          <button type="button" className="btn dark" onClick={clearAll}>
            Limpiar todo
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre de compania</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Direccion</th>
                <th>Notas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty">
                    No hay leads registrados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.company}</td>
                    <td>{lead.name}</td>

                    <td>
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                      ) : (
                        ""
                      )}
                    </td>

                    <td>
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                      ) : (
                        ""
                      )}
                    </td>

                    <td>{lead.address}</td>
                    <td>{lead.notes}</td>

                    <td>
                      <select
                        className={`status ${lead.status}`}
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                      >
                        <option>Nueva</option>
                        <option>Seguimiento</option>
                        <option>Cerrada</option>
                      </select>
                    </td>

                    <td className="actions">
                      <button type="button" className="small edit" onClick={() => editLead(lead)}>
                        Modificar
                      </button>

                      <button type="button" className="small delete" onClick={() => deleteLead(lead.id)}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}