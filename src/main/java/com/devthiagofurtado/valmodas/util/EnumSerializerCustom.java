package com.devthiagofurtado.valmodas.util;

import java.io.IOException;
import java.lang.reflect.Method;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

@SuppressWarnings("rawtypes")
public class EnumSerializerCustom extends StdSerializer{
	
	private static final long serialVersionUID = -3035196041049483120L;
	
	@SuppressWarnings("unchecked")
	protected EnumSerializerCustom() {
		super(EnumSerializerCustom.class);
	}

	@SuppressWarnings({ "unchecked"})
	@Override
	public void serialize(Object value, JsonGenerator gen, SerializerProvider provider) throws IOException {
		
		Class _class = value.getClass();
        Method[] methods = _class.getDeclaredMethods();
        gen.writeStartObject();
        
        if(_class.isEnum()) {
        	try {
        		gen.writeFieldName("valorEnum");
        		gen.writeObject(_class.getMethod("name").invoke(value));
			} catch (Exception e) {
				e.printStackTrace();
			}	
    	}
        
        for(Method method : methods) {
        	String name = method.getName();
        	String fieldName = null;
        	if(name.startsWith("get")) {
        		fieldName = name.substring(3).substring(0, 1).toLowerCase()+name.substring(4);
        	}else {
        		continue;
        	}
        	Object val = null;
        	try {
        		val = method.invoke(value);
        		gen.writeFieldName(fieldName);
        		gen.writeObject(val);
			} catch (Exception e) {
				e.printStackTrace();
			}
        }
        gen.writeEndObject();
	}

}
