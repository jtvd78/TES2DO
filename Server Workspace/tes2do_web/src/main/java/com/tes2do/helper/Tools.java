package main.java.com.tes2do.helper;

/**
 * Some random stuff that I use. 
 * @author justin
 *
 */
public class Tools {
	
	/**
	 * @param arr - Array to print
	 * @param spacer - Spacer String to append between the array values
	 * @return Returns each element in the array, separated by a spacer. 
	 */
	public static String arrToString(Object[] arr, String spacer){
		if(arr == null){
			return null;
		}
		
		StringBuffer out = new StringBuffer("");
		for(int i = 0; i < arr.length; i++){
			out.append(arr[i].toString());
			if(i < arr.length -1){
				out.append(spacer);
			}
		}
		
		return out.toString();
	}
}