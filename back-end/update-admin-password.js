import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function updateAdminPassword() {
  try {
    // Hash da senha
    const passwordHash = await bcrypt.hash('Vulcom@DSM', 12)
    
    // Atualiza a senha do admin
    const user = await prisma.user.update({
      where: { username: 'admin' },
      data: { password: passwordHash }
    })
    
    console.log('Senha do admin atualizada com sucesso!')
    console.log('Username:', user.username)
    console.log('Email:', user.email)
  } catch (error) {
    console.error('Erro ao atualizar senha:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminPassword()

