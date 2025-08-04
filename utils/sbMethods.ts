import { supabase } from './supabase'

export type User = {
  id: number
  email: string
  password: string
  games: string[]
}

// ---- ID (Getter Only) ----
export async function getIdByEmail(email: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('main')
    .select('id')
    .eq('email', email)
    .single()

  if (error) {
    console.log('Error getting ID by email:', error.message)
    return null
  }

  return data.id
}

// ---- User ----

export async function getUserById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('main')
      .select('*')
      .eq('id', id)
      .single()
  
    if (error) {
      console.log('Error fetching user:', error.message)
      return null
    }
  
    return data
  }
  
export async function getUserByEmail(email: string): Promise<User | null> {
    // Don't use .single() to avoid the error when no user is found
    const { data, error } = await supabase
      .from('main')
      .select('*')
      .eq('email', email)
  
    if (error) {
      console.log('Error getting user by email:', error.message)
      return null
    }
  
    // Return the first user if found, null otherwise
    return data && data.length > 0 ? data[0] : null
  }  

export async function addUser(email: string, password: string, games: string[] = []): Promise<User | null> {
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      console.log('User already exists with this email.')
      return null
    }
  
    try {
      // First, insert the user
      const { error: insertError } = await supabase
        .from('main')
        .insert([{ email, password, games }])
      
      if (insertError) {
        console.log('Error adding user:', insertError.message)
        return null
      }
      
      // Then fetch the newly created user
      const newUser = await getUserByEmail(email)
      return newUser
    } catch (err) {
      console.log('Exception adding user:', err)
      return null
    }
  }
  
  export async function removeUser(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('main')
      .delete()
      .eq('id', id)
  
    if (error) {
      console.log('Error removing user:', error.message)
      return false
    }
  
    return true
  }
  
  export async function verifyLogin(email: string, password: string): Promise<User | null> {
    console.log("Supabase verifyLogin: Starting verification");
    console.log("Supabase verifyLogin: Querying database for email:", email);
    
    const { data, error } = await supabase
      .from('main')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()
  
    if (error) {
      console.log('Supabase verifyLogin: Login failed:', error.message);
      return null;
    }
  
    console.log("Supabase verifyLogin: Login successful, user found");
    return data;
  }
  

// ---- Email ----
export async function getEmail(id: number): Promise<string | null> {
  const { data, error } = await supabase
    .from('main')
    .select('email')
    .eq('id', id)
    .single()

  if (error) {
    console.log('Error getting email:', error.message)
    return null
  }

  return data.email
}

export async function setEmail(id: number, email: string): Promise<boolean> {
  const { error } = await supabase
    .from('main')
    .update({ email })
    .eq('id', id)

  if (error) {
    console.log('Error setting email:', error.message)
    return false
  }

  return true
}

// ---- Password ----
export async function getPassword(id: number): Promise<string | null> {
  const { data, error } = await supabase
    .from('main')
    .select('password')
    .eq('id', id)
    .single()

  if (error) {
    console.log('Error getting password:', error.message)
    return null
  }

  return data.password
}

export async function setPassword(id: number, password: string): Promise<boolean> {
  const { error } = await supabase
    .from('main')
    .update({ password })
    .eq('id', id)

  if (error) {
    console.log('Error setting password:', error.message)
    return false
  }

  return true
}

// ---- Games ----
export async function getGames(id: number): Promise<string[] | null> {
  const { data, error } = await supabase
    .from('main')
    .select('games')
    .eq('id', id)
    .single()

  if (error) {
    console.log('Error getting games:', error.message)
    return null
  }

  return data.games
}

export async function setGames(id: number, games: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('main')
    .update({ games })
    .eq('id', id)

  if (error) {
    console.log('Error setting games:', error.message)
    return false
  }

  return true
}

export async function addGame(id: number, game: string): Promise<boolean> {
    const currentGames = await getGames(id)
    if (currentGames === null) return false
  
    if (!currentGames.includes(game)) {
      const updatedGames = [...currentGames, game]
      return await setGames(id, updatedGames)
    }
  
    return true // already exists, so nothing to add
  }
  
export async function removeGame(id: number, game: string): Promise<boolean> {
    const currentGames = await getGames(id)
    if (currentGames === null) return false

    const updatedGames = currentGames.filter(g => g !== game)
    return await setGames(id, updatedGames)
}
