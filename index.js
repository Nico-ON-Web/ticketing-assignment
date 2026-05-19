import express from 'express'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()

// =========================
// CONFIG
// =========================

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('view engine', 'ejs')

// =========================
// SUPABASE
// =========================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// =========================
// ROUTES ETUDIANT
// =========================

app.get('/', async (req, res) => {
    const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq("vu",false)
    .order('created_at', {
      ascending: true
    })

    if (error) {
        console.error(error)
        return res.send('Erreur récupération')
    }  
    res.render('index',{demandes: data})
})

app.post('/demande', async (req, res) => {

  const { name, type } = req.body

  const { error } = await supabase
    .from('ticket')
    .insert([
      {
        name,
        type
      }
    ])

  if (error) {
    console.error(error)
    return res.send('Erreur insertion')
  }

  res.redirect('/')
})


// =========================
// ROUTES FORMATEUR
// =========================

app.get('/admin', async (req, res) => {

  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .order('created_at', {
      ascending: true
    })

  if (error) {
    console.error(error)
    return res.send('Erreur récupération')
  }

  res.render('admin', {
    demandes: data
  })
})


// =========================
// ETUDIANT PRIS EN CHARGE
// =========================

app.post('/aide/:id', async (req, res) => {

  const id = req.params.id

  const { error } = await supabase
    .from('ticket')
    .update({
      vu: true
    })
    .eq('id', id)

  if (error) {
    console.error(error)
  }

  res.redirect('/admin')
})


// =========================
// SERVEUR
// =========================

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`)
})