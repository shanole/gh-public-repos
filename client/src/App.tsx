import { Container, Typography } from "@mui/material"

const App = () => {
  return (
    <>
    <div className="min-h-screen bg-slate-50">
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h3">GitHub Public Repos</Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
          Showing the 20 most recently created public MIT-licensed repositories
          from GitHub.
        </Typography>
      </Container>
    </div>
    </>
  )
}

export default App
