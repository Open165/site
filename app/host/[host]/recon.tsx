function handleSubmit(event) {
  'use server';
  event.preventDefault();
  const data = new FormData(event.target);
  const formData = Object.fromEntries(data.entries());
  console.log(formData);
}

export default function ReconForm({ host }: { host: string }) {
  return (
    <form onSubmit={handleSubmit}>
      Analyze the URL: <input name="url" defaultValue={`https://${host}`} />
      <button>Analyze</button>
    </form>
  );
}
