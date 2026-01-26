   
export interface JwtPayload {
     // subject: username del usuario
  sub: string;     
  // ID del usuario en la base de datos   
  idUsers?: number;
   // Array de roles: ['ROLE_ADMIN', 'ROLE_USER']      
  roles: string[];  
   // expiration: timestamp de expiración (segundos desde epoch)    
  exp: number;         
}