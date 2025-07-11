export default [
  {
    label: "Name",
    key: "name",
    sortable: true,
    order: "asc",
    sortIcon: true,
    sortName: "first_name",
  },
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Status",
    key: "status",
    filter: {
      type: "select",
      options: [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
    },
  },
  {
    label: "Job title",
    key: "job_role",
  },
  {
    label: "Organizational unit",
    key: "unit",
  },
  {
    key: "actions",
  },
];
