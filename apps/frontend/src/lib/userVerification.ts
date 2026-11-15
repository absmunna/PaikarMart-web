/**
 * User Verification Service (Mock)
 * 
 * This service acts as the single source of truth for cross-referencing 
 * emails and phone numbers against existing user accounts during 
 * guest checkout and account conversion.
 */

// Simulated database of existing user identifiers
const EXISTING_IDENTIFIERS = [
  'test@example.com',
  '1234567890',
  '@abs_munna', // Added a handle example
  'abs.munna1@gmail.com'
];

/**
 * Checks if a given email or phone number is already associated with an account.
 * @returns {Promise<boolean>} True if the user is a NEW guest (no duplicate found), 
 *                             False if a duplicate account exists.
 */
export const verifyUniqueUser = async (email?: string, phone?: string): Promise<boolean> => {
  // Simulate network latency
  return new Promise((resolve) => {
    setTimeout(() => {
      const isDuplicate = [email, phone].some(id => 
        id && EXISTING_IDENTIFIERS.includes(id.toLowerCase().trim())
      );
      
      // Return true if UNIQUE (i.e., not a duplicate)
      resolve(!isDuplicate);
    }, 800);
  });
};
